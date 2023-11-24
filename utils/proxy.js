const { faker } = require("@faker-js/faker");

/**
 * Fonction de matching entre le type sql et la validation de data avec joy
 * @param {object} target
 * @returns string
 */
const getJoyValidation = (target) => {
  const joyMatching = {
    VARCHAR: `  ${target.fieldName}: Joi.string().max(${target.long})${target.mandatoryField ? ".presence(option)":".presence('optional')"}`,
    TINYINT: `  ${target.fieldName}: Joi.number()${target.mandatoryField === "Oui" ? ".presence(option)": ".presence('optional')"}`,
    INT: `  ${target.fieldName}: Joi.number()${target.mandatoryField === "Oui" ? ".presence(option)": ".presence('optional')"}`,
    DATE: `  ${target.fieldName}: Joi.date()${target.mandatoryField === "Oui" ? ".presence(option)": ".presence('optional')"}`,
    DATETIME: `  ${target.fieldName}: Joi.date()${target.mandatoryField === "Oui" ? ".presence(option)": ".presence('optional')"}`,
    LONGTEXT: `  ${target.fieldName}: Joi.string()${target.mandatoryField === "Oui" ? ".presence(option)": ".presence('optional')"}`,
    TEXT: `  ${target.fieldName}: Joi.string()${target.mandatoryField === "Oui" ? ".presence(option)": ".presence('optional')"}`,
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
    VARCHAR: `  body("${target.fieldName}")${target.mandatoryField === "Oui" ? '.notEmpty()': ''}.isLength({ max: ${target.long}})`,
    TINYINT: `  body("${target.fieldName}")${target.mandatoryField === "Oui" ? '.notEmpty()': ''}.isNumerical()`,
    INT: `  body("${target.fieldName}")${target.mandatoryField === "Oui" ? '.notEmpty()': ''}.isNumerical()`,
    DATE: `  body("${target.fieldName}")${target.mandatoryField === "Oui" ? '.notEmpty()': ''}.isDate()`,
    DATETIME: `  body("${target.fieldName}")${target.mandatoryField === "Oui" ? '.notEmpty()': ''}.isIso8601().toDate()`,
    LONGTEXT: `  body("${target.fieldName}")${target.mandatoryField === "Oui" ? '.notEmpty()': ''}`,
    TEXT: `  body("${target.fieldName}")${target.mandatoryField === "Oui" ? '.notEmpty()': ''}`,
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
    VARCHAR: `${field.fieldName} VARCHAR(255)${field.mandatoryField === "Oui" ? ' NOT NULL' : ''}`,
    TINYINT: `${field.fieldName} TINYINT${field.mandatoryField === "Oui" ? ' NOT NULL' : ''}`,
    INT: `${field.fieldName} INT${field.mandatoryField === "Oui" ? ' NOT NULL' : ''}`,
    DATE: `${field.fieldName} DATE${field.mandatoryField === "Oui" ? ' NOT NULL' : ''}`,
    DATETIME: `${field.fieldName} DATETIME${field.mandatoryField === "Oui" ? ' NOT NULL' : ''}`,
    LONGTEXT: `${field.fieldName} LONGTEXT${field.mandatoryField === "Oui" ? ' NOT NULL' : ''}`,
    TEXT: `${field.fieldName} TEXT${field.mandatoryField === "Oui" ? ' NOT NULL' : ''}`,
  }

  return sqlSatement[field.fieldType];
};

/**
 * Memorise the faker function for later use
 * @param {object} field
 * @returns function
 */
const getFakeData = (field) => {
  const fakerObj = {
    VARCHAR: () => `"${faker.lorem.words({ min: 1, max: 3})}"`,
    TINYINT: () => faker.datatype.boolean() ? 0 : 1,
    INT: () => faker.number.int(1000),
    DATE: () => `"${faker.date.anytime().toISOString().split('T').shift()}"`,
    DATETIME: () => `"${faker.date.anytime().toISOString().split('T').shift()} 00:00:00"`,
    LONGTEXT: () => `"${faker.lorem.paragraphs(3)}"`,
    TEXT: () => `"${faker.lorem.paragraph()}"`,
  }

  return fakerObj[field.fieldType];
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
        };

        return validSystem[validator]();
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