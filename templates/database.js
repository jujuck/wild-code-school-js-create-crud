const { getFileContent, getUpdateFile } = require("wild-crud-js/utils/files");

const getSchema = (table, fields) => {
  return `
create table ${table} (
  id int unsigned primary key auto_increment not null,
  ${fields.map(f => f.sql).join(',\n')}
);
`;
}

const manageDatabase = async (table, fields) => {
  const schema = await getFileContent("./database/schema.sql");
  const index = schema.length + 2;

  const createDatabase = getUpdateFile(index, getSchema(table, fields), schema);
  return createDatabase;
};

module.exports = manageDatabase;