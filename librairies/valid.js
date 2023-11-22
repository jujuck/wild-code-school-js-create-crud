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
    VARCHAR: `  body("${target.fieldName}")${target.mandatory ? '.notEmpty()': ''}.isLength({ max: ${target.long}})),\n`,
    TINYINT: `  body("${target.fieldName}")${target.mandatory ? '.notEmpty()': ''}.isNumerical(),\n`,
    INT: `  body("${target.fieldName}")${target.mandatory ? '.notEmpty()': ''}.isNumerical(),\n`,
    DATE: `  body("${target.fieldName}")${target.mandatory ? '.notEmpty()': ''}.isDate(),\n`,
    DATETIME: `  body("${target.fieldName}")${target.mandatory ? '.notEmpty()': ''}.isIso8601().toDate(),\n`,
    LONGTEXT: `  body("${target.fieldName}")${target.mandatory ? '.notEmpty()': ''},\n`,
    TEXT: `  body("${target.fieldName}")${target.mandatory ? '.notEmpty()': ''},\n`,
  }
  return expressMatching[target.fieldType];
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

      return Reflect.get(...arguments);
    },
  };
}

module.exports = { getProxy };