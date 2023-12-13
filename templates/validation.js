const { toCapitalize } = require("wild-js-crud/utils/globals");

/**
 * Mise en place du template pour la validation de données avec express-validation
 * @param {object} fields
 * @param {string} capitalizeTable
 * @returns string
 */
const expressValidation = (fields, capitalizeTable) => {
  return `const { body, validationResult } = require("express-validator");

const validate${capitalizeTable}Validation = [
${fields.map(field => field.validation).join('')}
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

module.exports = validate${capitalizeTable};

`
};

/**
 * Mise en place du template pour la validation de données avec joy
 * @param {*} fields
 * @param {*} capitalizeTable
 * @returns
 */
const joyValidation = (fields, capitalizeTable) => {
  return `const Joi = require("joi");

const get${capitalizeTable}Schema = () => {
  return Joi.object({
    id: Joi.number().presence("optional"),
  ${fields.map(f => f.validation).join(' ')}
  });
};

const validate${capitalizeTable} = (req, res, next) => {
  const schema = get${capitalizeTable}Schema();

  const { error } = schema.validate(
    {
      ...req.body,
    },
    { abortEarly: false }
  );

  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    next();
  }
};

module.exports = validate${capitalizeTable};

`
}

/**
 * Appel à la fonction de création du template en fonction de type de validator
 * @param {string} validator
 * @param {object} fields
 * @param {string} table
 * @returns string
 */
const constructValidation = (validator, fields, table) => {
  const capitalizeTable = toCapitalize(table);
  const validModule = {
    "joi": () => joyValidation(fields, capitalizeTable),
    "express-validator": () => expressValidation(fields, capitalizeTable)// Non tester, donc non implémenter en choix user
  };
  return validModule[validator]();
};

module.exports = constructValidation;
