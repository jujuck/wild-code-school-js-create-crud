const { getFileContent, getUpdateFile, getIndexOnFile } = require("wild-js-crud/utils/files");
const { toCapitalize } = require("wild-js-crud/utils/globals")

/**
 * Prépare la liste de faker à ajouter
 * @param {object} fields
 * @returns string
 */
const getOneInsert = (fields) => {
  return `${fields.map(field => field.faker).join(',\n            ')}`
}

/**
 * Injecte le nombre de ?
 * @param {string} insertion
 * @returns string
 */
const getQuestionsMarks = (insertion) => {
  return new Array(+insertion)
    .fill()
    .map(el => '?')
    .join(', ');
};

/**
 * Ajoute le code pour le fichier seed.js
 * @param {string} insertion
 * @param {array} fields
 * @param {string} table
 * @returns string
 */
const getInsertion = (insertion, fields, table) => {
  const listOfFields = fields.map(f => f.fieldName);
  const capitalizeTable = toCapitalize(table);
  return `const queries${capitalizeTable} = [];

    // Insert fake data into the '${table}' table
    for (let i = 0; i < ${insertion}; i += 1) {
      queries${capitalizeTable}.push(
        database.query("insert into ${table}(${listOfFields.join(', ')}) values (${getQuestionsMarks(listOfFields.length)})", [
            ${getOneInsert(fields)}
          ]
        )
      );
    }

    // Wait for all the insertion queries to complete
    await Promise.all(queries${capitalizeTable});

`;
};

const manageFakeData = async (insertion, fields, table) => {
  const schema = await getFileContent("./seed.js");
  const index = getIndexOnFile(`// Close the database connection
    database.end();`, schema) - 2;
  const createFakeData = getUpdateFile(index, getInsertion(insertion, fields, table), schema);
  return createFakeData;
};

module.exports = manageFakeData;