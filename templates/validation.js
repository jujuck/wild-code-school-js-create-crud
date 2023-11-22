const expressValidation = (fields) => {
  return `const { body, validationResult } = require("express-validator");

const ${table}Validation = [
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

module.exports = ${table}Validation;

`
};

const joyValidation = (fields, table) => {
  const listOfField = fields.filter(f => f.mandatoryField === "Oui").map(f => f.fieldName).join(', ');
  return `const Joi = require("joi");

const ${table}Schema = Joi.object({
${fields.map(f => f.validation).join('')}
});

const ${table}Validation = (req, res, next) => {
  const { ${listOfField} } = req.body;

  const { error } =${table}Schema.validate(
    { ${listOfField} },
    { abortEarly: false }
  );

  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    next();
  }
};

module.export = ${table}Validation;

`
}

const constructValidation = (validator, fields, table) => {
  const validModule = {
    "joi": () => joyValidation(fields, table),
    "express-validator": () => expressValidation(fields, table)
  }
  return validModule[validator]()
  ;
};

module.exports = constructValidation;
