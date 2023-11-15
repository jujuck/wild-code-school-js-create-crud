const chalk = require("chalk");
const { getTableName, getFields } = require("wild-crud-js/librairies/user");
const { checkIfTableExist } = require("wild-crud-js/librairies/checks");


const log = console.log;
const error = console.error;

(async () => {

  const table = await getTableName();
  if (await checkIfTableExist(table)) {
    log(chalk.green(`Veuillez maintenant renseigner les champs de votre table.`));
    log(`${chalk.green('Le champ')} id INT AUTO INCREMENT PRIMARY KEY NOT NULL est automatique`);
    const fields = await getFields();

  } else {
    error(chalk.red(`La table -- ${table} -- semble déjà exister. Verifier puis recommencer !`))
  }
})();
