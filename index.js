const chalk = require("chalk");
const { getTableName, getFields } = require("wild-crud-js/librairies/user");
const { checkIfTableExist } = require("wild-crud-js/librairies/checks");
const { constructController, constructManager, manageTables } = require("wild-crud-js/templates/index");
const { setFile } = require("wild-crud-js/librairies/files");


const log = console.log;
const error = console.error;

(async () => {

  const table = await getTableName();
  if (checkIfTableExist(table)) {
    // Mémorisation du nom de la table en lettre capitale
    const capitalizeTable = table.charAt(0).toUpperCase() + table.slice(1);

    // Message d'avertissement pour l'utilsateur
    log(chalk.green(`Veuillez maintenant renseigner les champs de votre table.`));
    log(`${chalk.green('Le champ')} id INT AUTO INCREMENT PRIMARY KEY NOT NULL est automatique`);

    // Récupération des champs au format tableau
    const fields = await getFields();

    // Création et enregistrement du controller
    const controllers = constructController(table);
    await setFile(controllers, `./src/controllers/${table}Controllers.js`);

    // Création et enregistrement du manager
    const managers = constructManager(table, fields, capitalizeTable);
    await setFile(managers, `./src/models/${capitalizeTable}Managers.js`)

    // Modification du tables.js
    const tables = await manageTables(capitalizeTable);
    await setFile(tables, `./src/tables.js`)

  } else {
    error(chalk.red(`La table -- ${table} -- semble déjà exister. Verifier puis recommencer !`))
  }
})();
