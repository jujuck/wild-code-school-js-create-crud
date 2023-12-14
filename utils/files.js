const fs = require("fs");
const YAML = require("yaml");

const getModulePath = () => {
  return require.resolve("wild-js-crud").split('index.js').shift()
}

const getYamlInformationFromFile = (path) => {
  const file = fs.readFileSync(getModulePath() + path, "utf8");
  return YAML.parse(file);
};

/**
 * Récupère le contenu d'un fichier
 * @param {string} path
 * @returns
 */
const getFileContent = (path) => {
  return fs.readFileSync(path, "utf8");
};

/**
 * Enregistre un nouveau fichier
 * @param {string} file
 * @param {string} path
 * @returns
 */
const setFile = async (file, path) => {
  return await fs.writeFileSync(path, file);
}

/**
 * Créer un nouveau dossier
 * @param {string} path
 * @returns
 */
const setFolder = async (path) => {
  return fs.mkdirSync(path);
}

const getIndexOnFile = (str, tables) => {
  return tables.indexOf(str)
};


const getUpdateFile = (index, str, file) => {
  return file.slice(0, index) + str + file.slice(index)
}

module.exports = {
  getYamlInformationFromFile,
  getFileContent,
  setFile,
  setFolder,
  getIndexOnFile,
  getUpdateFile
};
