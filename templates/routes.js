const { getFileContent, getIndexOnFile, getUpdateFile } = require("wild-js-crud/utils/files");
const { toCapitalize } = require("wild-js-crud/utils/globals");

/**
 * Prépare le template de route à injecter.
 * @param {string} table
 * @param {string} validator
 * @param {string} middleWareFolder
 * @returns string
 */
const getTemplate = (table, validator, middleWareFolder) => {
  const capitalizeTable = toCapitalize(table)
  const middle = validator !== "none" ? ` validate${capitalizeTable},` : ""
  return `
const ${table}Controllers = require("./controllers/${table}Controllers");
${validator !== "none" ? `// const ${middle} = require("./${middleWareFolder}/${middle}");\n` : ""}
router.get("/${table}s", ${table}Controllers.browse);
router.get("/${table}s/:id", ${table}Controllers.read);
// router.post("/${table}s",${middle} ${table}Controllers.add);
// router.put("/${table}s/:id",${middle} ${table}Controllers.edit);
// router.delete("/${table}s/:id", ${table}Controllers.destroy);

`;
}

/**
 * Update the file router.js with the new routes
 * @param {string} table
 * @param {string} validator
 * @param {string} middleWareFolder
 * @returns string
 */
const manageRoutes = async (table, validator, middleWareFolder) => {
  const router = await getFileContent("./src/router.js");
  const index = getIndexOnFile("const router = express.Router();", router) + 33;

  return getUpdateFile(index, getTemplate(table, validator, middleWareFolder), router);
};

module.exports = manageRoutes;