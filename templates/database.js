const { getFileContent, getUpdateFile } = require("wild-js-crud/utils/files");



const getOneInsert = (fields) => {
  return `(${fields.map(field => field.faker()).join(', ')})`
}

const getInsertion = (insertion, fields, table) => {
  const listOfFields = fields.map(f => f.fieldName).join(', ');
  return `\n\nINSERT INTO ${table} (${listOfFields}) VALUES ${new Array(+insertion)
      .fill()
      .map(el => {
        return getOneInsert(fields);
      })
      .join(',\n')
    };`
}

const getSchema = (table, fields, insertion) => {
  const insertValue = insertion ? getInsertion(insertion, fields, table) : '';
  return `
create table ${table} (
  id int unsigned primary key auto_increment not null,
  ${fields.map(f => f.sql).join(',\n')}
);


${insertValue}
`;
}


const manageDatabase = async (table, fields, insertion) => {
  const schema = await getFileContent("./database/schema.sql");
  const index = schema.length + 2;
  const createDatabase = getUpdateFile(index, getSchema(table, fields, insertion), schema);
  return createDatabase;
};

module.exports = manageDatabase;