const { getFileContent, getIndexOnFile, getUpdateFile } = require("wild-crud-js/librairies/files");

const manageTables = async (capitalizeTable) => {
  const tables = await getFileContent("./src/tables.js");
  const managerName = `${capitalizeTable}Manager`

  const startIndex = getIndexOnFile("const managers = [", tables);
  const endIndex = startIndex + "const managers = [".length;

  const tablesWithManagers = getUpdateFile(endIndex, `\n  ${managerName},`, tables);
  const tablesWithRequire = getUpdateFile(startIndex, `const ${managerName} = require("./models/${managerName}");\n\n`, tablesWithManagers);

  return tablesWithRequire;
};

module.exports = manageTables;