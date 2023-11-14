const { getFileContent } = require("wild-crud-js/librairies/files");

const checkIfTableExist = (table) => {
  const content = getFileContent("./database/schema.sql");
  return !content.toLowerCase().includes(`create table ${table} (`);
};

module.exports = {
  checkIfTableExist,
};
