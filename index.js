const chalk = require("chalk");
const { getTableName } = require("wild-crud-js/librairies/user");
const { checkIfTableExist } = require("wild-crud-js/librairies/checks");


const log = console.log();
const error = console.error();

(async () => {
  const table = await getTableName();
  if (await checkIfTableExist(table)) {
    log("All good");
  } else {
    error(chalk.red(`La table -- ${table} -- semble déjà exister. Verifier puis recommencer !`))
  }
})();
