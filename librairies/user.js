const { select, checkbox, confirm, input } = require("@inquirer/prompts");
// import chalk from "chalk";

const { getYamlInformationFromFile } = require("./files");

const getTableName = () => {
  const data = getYamlInformationFromFile("ressources/table.yml");
  return input({ message: data.statement });
};

module.exports = {
  getTableName,
};
