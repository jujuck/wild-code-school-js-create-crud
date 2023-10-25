const { getTableName } = require("./librairies/user");
const { checkIfTableExist } = require("./librairies/verification");

(async () => {
  const table = await getTableName();
  console.log(table);
  if (await checkIfTableExist(table)) {
    console.log("All good");
  }
})();
