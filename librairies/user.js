const { select, checkbox, confirm, input } = require("@inquirer/prompts");
const { getYamlInformationFromFile } = require("./files");
const { getProxy } = require("wild-crud-js/librairies/valid");

/**
 * Demande le nom de la table à l'utilisateur
 * @returns Object { message : string}
 */
const getTableName = async () => {
  const data = await getYamlInformationFromFile("ressources/table.yml");
  return (await input({ message: data.statement })).toLowerCase();
};

/**
 * Convertit le champ YAML en object { name, value }
 * @param [string] choices
 * @returns Array[{name: string, value: string}]
 */
const getChoices = (choices) => {
  return choices.map(ch => ({ name: ch, value: ch}))
}

/**
 * Demande à l'utilisateur la définition des champs
 * @returns Proxy {
 *  fieldName: string,
 *  fieldType: string,
 *  long: string,
 *  mandatory: string
 *  Proxy : validation
 * }
 */
const getField = async (validator) => {
  const { name, type, varchar, mandatory } = await getYamlInformationFromFile("ressources/fields.yml");
  const fieldName = await input({ message: name.statement});
  const fieldType = await select({ message: type.statement, choices: getChoices(type.answers)});
  const long = fieldType === "VARCHAR" ?  await input({ message: varchar.statement}) : null;
  const mandatoryField = await select({ message: mandatory.statement, choices: getChoices(mandatory.answers)});
  const handler = getProxy(validator);

  let field = {
    fieldName,
    fieldType,
    long,
    mandatoryField
  }
  const proxy = new Proxy(field, handler);
  console.log("In get Field")
  console.log(proxy.validation)
  return proxy;
}

/**
 * Demande l'ensemble des champs à l'utililisateur
 * @param {string} validator module
 * @returns Array[{
 *  fieldName: string,
 *  fieldType: string,
 *  long: string,
 *  mandatoryField: string
 * }]
 */
const getFields = async (validator) => {
  const fields = [];
  let keepGoing = true
  while (keepGoing) {
    const f = await getField(validator);
    fields.push(f);

    keepGoing = await select({
      message: "Avez vous un autre champ à ajouter ?",
      choices: [
        { name: "Oui", value: true},
        { name: "Non", value: false}
      ]
    })
  }
  return fields
}

const getValidator = async () => {
  return await select({ message:"Quelle est la librairie de validation de données utilisées ? ", choices: [{ name: "Joi", value: "joi"}, { name: "express-validator", value: "express-validator"}, { name: "none", value: "none"}]});
}

module.exports = {
  getTableName,
  getFields,
  getValidator
};
