const { getFileContent } = require("wild-crud-js/librairies/files");


const getIndexOnFile = (str, tables) => {
  return tables.indexOf(str)
};


const getUpdateFile = (index, str, file) => {
  return file.slice(0, index) + str + file.slice(index)
}

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