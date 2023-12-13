const fs = require('fs')
const { getFileContent } = require("wild-js-crud/utils/files");

const checkIfTableExist = (table) => {
  const content = getFileContent("./database/schema.sql");
  return !content.toLowerCase().includes(`create table ${table} (`);
};

const checkValidatorsFolder = async () => {
  const folders = await fs.readdirSync("./src");
  return folders.find(dir => dir.toLowerCase().includes("valid"));
}

module.exports = {
  checkIfTableExist,
  checkValidatorsFolder
};
