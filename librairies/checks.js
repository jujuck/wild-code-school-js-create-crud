const fs = require('fs')
const { getFileContent } = require("wild-crud-js/librairies/files");

const checkIfTableExist = (table) => {
  const content = getFileContent("./database/schema.sql");
  return !content.toLowerCase().includes(`create table ${table} (`);
};

const checkMiddlewareFolder = async () => {
  const folders = await fs.readdirSync("./src");
  return folders.find(dir => dir.toLowerCase().includes("middle"));
}

module.exports = {
  checkIfTableExist,
  checkMiddlewareFolder
};
