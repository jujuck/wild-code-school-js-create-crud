
/**
 * Mise en place du template pour la validation de données avec express-validation
 * @param {object} fields
 * @param {string} table
 * @returns string
 */
const expressValidation = (fields, table) => {
  return `const { body, validationResult } = require("express-validator");

const ${table}Validation = [
${fields.map(field => field.validation).join(',\n  ')}
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

module.exports = ${table}Validation;

`
};

/**
 * Mise en place du template pour la validation de données avec joy
 * @param {*} fields
 * @param {*} table
 * @returns
 */
const joyValidation = (fields, table) => {
  return `const Joi = require("joi");

const getSchema = (req) => {
  const option = req.method === "POST" ? "required" : "optional";
  return Joi.object({
  ${fields.map(f => f.validation).join(',\n  ')}
  });
};

const ${table}Validation = (req, res, next) => {
  const schema = getSchema(req);

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

module.exports = ${table}Validation;

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
  const validModule = {
    "joi": () => joyValidation(fields, table),
    "express-validator": () => expressValidation(fields, table)
  }
  return validModule[validator]()
  ;
};

module.exports = constructValidation;
