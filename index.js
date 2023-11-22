const chalk = require("chalk");
const { getTableName, getFields, getValidator } = require("wild-crud-js/librairies/user");
const { checkIfTableExist, checkMiddlewareFolder } = require("wild-crud-js/librairies/checks");
const { constructController, constructManager, manageTables, constructValidation, manageRoutes } = require("wild-crud-js/templates/index");
const { setFile, setFolder } = require("wild-crud-js/librairies/files");


const log = console.log;
const error = console.error;

(async () => {

  const table = await getTableName();
  if (checkIfTableExist(table)) {
    // Mémorisation du nom de la table en lettre capitale
    const capitalizeTable = table.charAt(0).toUpperCase() + table.slice(1);

    // Message d'avertissement pour l'utilsateur
    log(chalk.green(`Veuillez maintenant renseigner les champs de votre table.`));
    log(chalk.yellow('Le champ id INT AUTO INCREMENT PRIMARY KEY NOT NULL est automatique'));

    // Récupération des champs au format tableau
    const validator = await getValidator();
    const fields = await getFields(validator);

    // Création et enregistrement du controller
    const controllers = constructController(table);
    await setFile(controllers, `./src/controllers/${table}Controllers.js`);
    log(chalk.green(`Le fichier ${table}Controllers.js a bien été crée dans le dossier /src/controllers.`));
    log(chalk.yellow(`C'est un fichier type a ajusté en fonction de vos besoins réels`));

    // Création et enregistrement du manager
    const managers = constructManager(table, fields, capitalizeTable);
    await setFile(managers, `./src/models/${capitalizeTable}Managers.js`);
    log(chalk.green(`Le fichier ${capitalizeTable}Manager.js a bien été crée dans le dossier /src/models.`));
    log(chalk.yellow(`C'est un fichier type a ajusté en fonction de vos besoins réels`));

    // Modification du tables.js
    const tables = await manageTables(capitalizeTable);
    await setFile(tables, `./src/tables.js`);
    log(chalk.green(`Le fichier tables.js a bien été modifié. L'import du manager a été mis en place et son ajout dans le tableau des managers également`));

    // Création du fichiers de validation de données
    let middleWareFolder = "";
    if(validator !== "none") {
      const validationFile = await constructValidation(validator, fields, table);
      middleWareFolder = await checkMiddlewareFolder()
      if (!middleWareFolder) {
        middleWareFolder = "middlewares"
        await setFolder(`./src/${middleWareFolder}`);
      }
      await setFile(validationFile, `./src/${middleWareFolder}/${table}Validation.js`);
      log(chalk.green(`Le fichier de validation de données a bien été crée dans le dossier /src/${middleWareFolder}.`));
      log(chalk.yellow(`C'est un fichier type a ajusté en fonction de vos besoins réels`));
    }

    // Mise à jour des routes
    const routes = await manageRoutes(table, validator, middleWareFolder);
    await setFile(routes, `./src/routes.js`);
    log(chalk.green(`Le fichier router.js a bien été modifié. L'import du controller a été mis en place, ainsi que les routes basic du CRUD.`))
    log(chalk.yellow(`Si vous avez choisi un validateur de données, celui ci a été ajouté dans les routes POST et PUT`));



    // Mise en place de la création de la db et insert de 3 ligne avec faker
    // => redonner l'info des n° des lignes insérés
    // Donner un message de validation à l'utilisateur
    const database = await manageDatabase(table, fields);
    await setFile(database, `./database.schema.sql`);
    log(chalk.green(`Le fichier schema.sql a bien été modifié. la création de la table a été ajouté, ainsi que 3 insertions en lorem Ispum.`))
    log(chalk.yellow(`C'est un fichier type a ajusté en fonction de vos besoins réels`));
    log(chalk.yellow(`En cas de clé étrangères, veuillez renseigner les champs à la main et réorganiser l'ordre de création des tables`));


    // Mise en place des tests
    // Donner un message de validation à l'utilisateur




  } else {
    error(chalk.red(`La table -- ${table} -- semble déjà exister. Verifier puis recommencer !`))
  }
})();
