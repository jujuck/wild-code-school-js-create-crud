const chalk = require("chalk");
const { getTableName, getFields } = require("wild-crud-js/librairies/user");
const { checkIfTableExist } = require("wild-crud-js/librairies/checks");
const { constructController, constructManager } = require("wild-crud-js/templates/index");
const { setFile } = require("wild-crud-js/librairies/files");


const log = console.log;
const error = console.error;

(async () => {

  const table = await getTableName();
  if (await checkIfTableExist(table)) {
    const capitalizeTable = table.charAt(0).toUpperCase() + table.slice(1);
    log(chalk.green(`Veuillez maintenant renseigner les champs de votre table.`));
    log(`${chalk.green('Le champ')} id INT AUTO INCREMENT PRIMARY KEY NOT NULL est automatique`);
    const fields = await getFields();
    const controllers = await constructController(table);
    await setFile(controllers, `./src/controllers/${table}Controllers.js`)
    const managers = await constructManager(table, fields, capitalizeTable);
    await setFile(managers, `./src/models/${capitalizeTable}Managers.js`)

  } else {
    error(chalk.red(`La table -- ${table} -- semble déjà exister. Verifier puis recommencer !`))
  }
})();
