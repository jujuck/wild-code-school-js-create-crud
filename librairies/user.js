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
 * }
 */
const getField = async (validator) => {
  const { name, type, varchar, mandatory } = await getYamlInformationFromFile("ressources/fields.yml");
  const fieldName = await input({ message: name.statement});
  const fieldType = await select({ message: type.statement, choices: getChoices(type.answers)});
  const long = fieldType === "VARCHAR" ?  await input({ message: varchar.statement}) : null;
  const mandatoryField = await select({ message: mandatory.statement, choices: getChoices(mandatory.answers)});


  return new Proxy({
    fieldName,
    fieldType,
    long,
    mandatoryField
  },
  getProxy(validator));
}

/**
 * Demande l'ensemble des champs à l'utililisateur
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
    console.log(f.validation)
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

module.exports = {
  getTableName,
  getFields
};
