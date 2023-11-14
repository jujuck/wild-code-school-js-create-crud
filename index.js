const { getTableName } = require("wild-crud-js/librairies/user");
const { checkIfTableExist } = require("wild-crud-js/librairies/checks");

(async () => {
  const table = await getTableName();
  console.log(table);
  if (await checkIfTableExist(table)) {
    console.log("All good");
  }
})();
