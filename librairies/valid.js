const getJoyValidation = (target) => {
  const joyMatching = {
    VARCHAR: `  ${target.fieldName}: Joi.string().max(${target.long})${target.mandatory ? ".required()":""},\n`,
    TINYINT: `  ${target.fieldName}: Joi.number()${target.mandatory ? ".required()": ""},\n`,
    INT: `  ${target.fieldName}: Joi.number()${target.mandatory ? ".required()": ""},\n`,
    DATE: `  ${target.fieldName}: Joi.date()${target.mandatory ? ".required()": ""},\n`,
    DATETIME: `  ${target.fieldName}: Joi.date().iso()${target.mandatory ? ".required()": ""},\n`,
    LONGTEXT: `  ${target.fieldName}: Joi.string()${target.mandatory ? ".required()": ""},\n`,
    TEXT: `  ${target.fieldName}: Joi.string()${target.mandatory ? ".required()": ""},\n`,
  }

  return joyMatching[target.fieldType];
}
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