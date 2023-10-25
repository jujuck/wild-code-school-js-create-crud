const fs = require("fs");
const YAML = require("yaml");

const getModulePath = () => {
  return require.resolve("wild-crud-js").split('index.js').shift()
}

const getYamlInformationFromFile = (path) => {
  const file = fs.readFileSync(getModulePath() + path, "utf8");
  return YAML.parse(file);
};

const getFileContent = (path) => {
  return fs.readFileSync(getModulePath() + path, "utf8");
};

module.exports = {
  getYamlInformationFromFile,
  getFileContent,
};
