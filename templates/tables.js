const { getFileContent, getIndexOnFile, getUpdateFile } = require("wild-js-crud/utils/files");
const { toCapitalize } = require("wild-js-crud/utils/globals")

const manageTables = async (table) => {
  const tables = await getFileContent("./src/tables.js");
  const managerName = `${toCapitalize(table)}Manager`

  const startIndex = getIndexOnFile("const managers = [", tables);
  const endIndex = startIndex + "const managers = [".length;

  const tablesWithManagers = getUpdateFile(endIndex, `\n  ${managerName},`, tables);
  const tablesWithRequire = getUpdateFile(startIndex, `const ${managerName} = require("./models/${managerName}");\n\n`, tablesWithManagers);

  return tablesWithRequire;
};

module.exports = manageTables;