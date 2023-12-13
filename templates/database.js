const { getFileContent, getUpdateFile } = require("wild-js-crud/utils/files");

/**
 * Génére le template de creation de table
 * @param {string} table
 * @param {array} fields
 * @returns string
 */
const getSchema = (table, fields) => {
  return `
create table ${table} (
  id int unsigned primary key auto_increment not null,
  ${fields.map(f => f.sql).join(',\n  ')}
);

`;
}

/**
 * Générer le template mis à jour pur le fichier de BDD
 * @param {string} table
 * @param {array} fields
 * @returns string
 */
const manageDatabase = async (table, fields) => {
  const schema = await getFileContent("./database/schema.sql");
  const index = schema.length + 2;
  const createDatabase = getUpdateFile(index, getSchema(table, fields), schema);
  return createDatabase;
};

module.exports = manageDatabase;