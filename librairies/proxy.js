const { faker } = require("@faker-js/faker");

/**
 * Fonction de matching entre le type sql et la validation de data avec joy
 * @param {object} target
 * @returns string
 */
const getJoyValidation = (target) => {
  const joyMatching = {
    VARCHAR: `  ${target.fieldName}: Joi.string().max(${target.long})${target.mandatory ? ".required()":""},\n`,
    TINYINT: `  ${target.fieldName}: Joi.number()${target.mandatory === "Oui" ? ".required()": ".isOptionnal()"},\n`,
    INT: `  ${target.fieldName}: Joi.number()${target.mandatory === "Oui" ? ".required()": ".isOptionnal()"},\n`,
    DATE: `  ${target.fieldName}: Joi.date()${target.mandatory === "Oui" ? ".required()": ".isOptionnal()"},\n`,
    DATETIME: `  ${target.fieldName}: Joi.date().iso()${target.mandatory === "Oui" ? ".required()": ".isOptionnal()"},\n`,
    LONGTEXT: `  ${target.fieldName}: Joi.string()${target.mandatory === "Oui" ? ".required()": ".isOptionnal()"},\n`,
    TEXT: `  ${target.fieldName}: Joi.string()${target.mandatory === "Oui" ? ".required()": ".isOptionnal()"},\n`,
  }

  return joyMatching[target.fieldType];
}

/**
 * Fonction de matching entre le type sql et la validation de data avec express-validation
 * @param {object} target
 * @returns string
 */
const getExpressValidation = (target) => {
  const expressMatching = {
    VARCHAR: `  body("${target.fieldName}")${target.mandatory === "Oui" ? '.notEmpty()': ''}.isLength({ max: ${target.long}}),\n`,
    TINYINT: `  body("${target.fieldName}")${target.mandatory === "Oui" ? '.notEmpty()': ''}.isNumerical(),\n`,
    INT: `  body("${target.fieldName}")${target.mandatory === "Oui" ? '.notEmpty()': ''}.isNumerical(),\n`,
    DATE: `  body("${target.fieldName}")${target.mandatory === "Oui" ? '.notEmpty()': ''}.isDate(),\n`,
    DATETIME: `  body("${target.fieldName}")${target.mandatory === "Oui" ? '.notEmpty()': ''}.isIso8601().toDate(),\n`,
    LONGTEXT: `  body("${target.fieldName}")${target.mandatory === "Oui" ? '.notEmpty()': ''},\n`,
    TEXT: `  body("${target.fieldName}")${target.mandatory === "Oui" ? '.notEmpty()': ''},\n`,
  }
  return expressMatching[target.fieldType];
}


/**
 * Renvoie la ligne de création de champs
 * @param {object} field
 * @returns string
 */
const getSQLStatement = (field) => {
  const sqlSatement = {
    VARCHAR: `  ${field.fieldName} VARCHAR(255) ${field.mandatory === "Oui" ? 'NOT NULL' : ''}\n`,
    TINYINT: `  ${field.fieldName} TINYINT ${field.mandatory === "Oui" ? 'NOT NULL' : ''}\n`,
    INT: `  ${field.fieldName} INT ${field.mandatory === "Oui" ? 'NOT NULL' : ''}\n`,
    DATE: `  ${field.fieldName} DATE ${field.mandatory === "Oui" ? 'NOT NULL' : ''}\n`,
    DATETIME: `  ${field.fieldName} DATETIME ${field.mandatory === "Oui" ? 'NOT NULL' : ''}\n`,
    LONGTEXT: ` ${field.fieldName} LONGTEXT ${field.mandatory === "Oui" ? 'NOT NULL' : ''}\n`,
    TEXT: `  ${field.fieldName} TEXT ${field.mandatory === "Oui" ? 'NOT NULL' : ''}\n`,
  }

  return sqlSatement[field.fieldType]
};

/**
 * Memorise the faker function for later use
 * @param {object} field
 * @returns function
 */
const getFakeData = (field) => {
  const faker = {
    VARCHAR: () => faker.lorem.words({min: 1, max3}),
    TINYINT: () =>faker.number.int({min: 0, max: 2}),
    INT: () => faker.number.int(1000),
    DATE: () => faker.date.anytime().split('T').shift(),
    DATETIME: () => faker.date.anytime(),
    LONGTEXT: () => faker.lorem.paragraphs(3),
    TEXT: () => faker.lorem.paragraph(),
  }

  return faker[field.fieldType];
}

/**
 * Mise en place du proxy sur le champ
 * @param {string} validator
 * @returns object (Handler)
 */
const getProxy = (validator) => {
  return {
    get: function (target, prop, receiver) {
      if (prop == 'validation') {
        const validSystem = {
          joi: () => getJoyValidation(target),
          "express-validator":() => getExpressValidation(target),
          none: () => "No field validation"
        }

        return validSystem[validator]()
      }

      if (prop == 'sql') {
        return getSQLStatement(target);
      }

      if (prop == "faker") {
        return getFakeData(target);
      }

      return Reflect.get(...arguments);
    },
  };
}

module.exports = { getProxy };