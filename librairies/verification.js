const { getFileContent } = require("./files");

const checkIfTableExist = (table) => {
  const content = getFileContent(`ressources/table.yml`);
  console.log(content);
  return true;
};

module.exports = {
  checkIfTableExist,
};
