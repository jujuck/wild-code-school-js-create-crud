const chalk = require("chalk");
const { execSync } = require("child_process");

const {
  getTableName,
  getFields,
  getValidator,
  getInsertData,
  getGo,
} = require("wild-js-crud/utils/user");
const {
  checkIfTableExist,
  checkValidatorsFolder,
} = require("wild-js-crud/utils/checks");
const {
  constructController,
  constructManager,
  manageTables,
  constructValidation,
  manageRoutes,
  manageDatabase,
  manageFakeData,
} = require("wild-js-crud/templates/index");
const { setFile, setFolder } = require("wild-js-crud/utils/files");
const { toCapitalize, setBreak } = require("wild-js-crud/utils/globals");

const log = console.log;
const error = console.error;

const createTable = async (table, fields) => {
  const database = await manageDatabase(table, fields);
  await setFile(database, `./database/schema.sql`);
  log(
    chalk.green(
      `Le fichier schema.sql a bien été modifié. La création de la table a été ajouté.`
    )
  );
  log(
    chalk.yellow(
      `C'est un fichier type a ajusté en fonction de vos besoins réels`
    )
  );
  log(
    chalk.yellow(
      `En cas de clés étrangères, veuillez renseigner les champs à la main et réorganiser l'ordre de création des tables. \n`
    )
  );

  await execSync("npm run db:migrate");
};

const createController = async (table) => {
  // Création et enregistrement du controller
  const controllers = constructController(table);
  await setFile(controllers, `./src/controllers/${table}Controllers.js`);
  log(
    chalk.green(
      `Le fichier ${table}Controllers.js a bien été crée dans le dossier /src/controllers.`
    )
  );
  log(
    chalk.yellow(
      `C'est un fichier type a ajusté en fonction de vos besoins réels. \n`
    )
  );
};

const updateTables = async (table) => {
  // Modification du tables.js
  const tables = await manageTables(table);
  await setFile(tables, `./src/tables.js`);
  log(
    chalk.green(
      `Le fichier tables.js a bien été modifié. L'import du manager a été mis en place et son ajout dans le tableau des managers également. \n`
    )
  );
};

const createManager = async (table, fields) => {
  // Création et enregistrement du manager
  const managers = constructManager(table, fields);
  await setFile(managers, `./src/models/${toCapitalize(table)}Manager.js`);
  log(
    chalk.green(
      `Le fichier ${toCapitalize(
        table
      )}Manager.js a bien été crée dans le dossier /src/models.`
    )
  );
  log(
    chalk.yellow(
      `C'est un fichier type a ajusté en fonction de vos besoins réels. \n`
    )
  );
  await updateTables(table);
};

const createValidator = async (validator, fields, table) => {
  const validationFile = await constructValidation(validator, fields, table);
  let validatorsFolder = await checkValidatorsFolder();
  if (!validatorsFolder) {
    validatorsFolder = "validators";
    await setFolder(`./src/${validatorsFolder}`);
  }
  await setFile(
    validationFile,
    `./src/${validatorsFolder}/validate${toCapitalize(table)}.js`
  );

  log(
    chalk.green(
      `Le fichier de validation de données a bien été crée dans le dossier /src/${validatorsFolder}.`
    )
  );
  log(
    chalk.yellow(
      `C'est un fichier type a ajusté en fonction de vos besoins réels. \n`
    )
  );
  return validatorsFolder;
};

const updateRoute = async (table, validator, validatorsFolder) => {
  // Mise à jour des routes
  const routes = await manageRoutes(table, validator, validatorsFolder);
  await setFile(routes, `./src/router.js`);

  log(
    chalk.green(
      `Le fichier router.js a bien été modifié. L'import du controller a été mis en place, ainsi que les routes basic du CRUD.`
    )
  );
  log(
    chalk.yellow(
      `Si vous avez choisi un validateur de données, celui ci a été ajouté dans les routes POST et PUT. \n`
    )
  );
};

const updateSeed = async (fields, table) => {
  const insertion = await getInsertData();
  if (+insertion > 0) {
    const insertData = await manageFakeData(insertion, fields, table);
    await setFile(insertData, `./seed.js`);

    log(chalk.green(`Le fichier seed.js a bien été modifié.`));
    log(
      chalk.yellow(
        `C'est un fichier type a ajusté en fonction de vos besoins réels`
      )
    );

    await execSync("npm run db:seed");
  }
};

(async () => {
  const table = await getTableName();
  const isTable = checkIfTableExist(table);

  if (!isTable) {
    error(chalk.red(`La table -- ${table} -- semble déjà existée!`));
    const keepGoing = getGo("Voulez vous continuez ?");
    if (!keepGoing) return;
  }

  // Récupération des champs au format tableau
  const validator = await getValidator();
  // Message d'avertissement pour l'utilsateur
  log(chalk.green(`Veuillez maintenant renseigner les champs de votre table.`));
  log(
    chalk.yellow(
      "Le champ id INT AUTO INCREMENT PRIMARY KEY NOT NULL est automatique. \n"
    )
  );
  const fields = await getFields(validator);
  await setBreak();

  if (await getGo("Voulez vous mettre en place le controller ?")) {
    await createController(table);
    await setBreak();
  }

  if (await getGo("Voulez vous mettre en place le manager ?")) {
    await createManager(table, fields);
    await setBreak();
  }

  let validatorsFolder = "";
  if (
    validator !== "none" &&
    await getGo("Voulez vous mettre en place le fichier de validation")
  ) {
    validatorsFolder = await createValidator(validator, fields, table);
    await setBreak();
  } else {
    validator = "none";
  }

  if (await getGo("Voulez vous mettre à jour le fichier route.js")) {
    await updateRoute(table, validator, validatorsFolder);
    await setBreak();
  }

  if (!isTable) {
    error(
      chalk.red(
        `Attention, la table -- ${table} -- existe déjà dans le fichier schema.sql`
      )
    );
  }
  if (
    await getGo(
      `Voulez vous ${isTable ? "" : "re"}génerer le script sql de création ?`
    )
  ) {
    await createTable(table, fields);
    await setBreak();
  }

  if (await getGo("Voulez vous ajouter de fausses données à votre table")) {
    await updateSeed(fields, table);
  }
})();
