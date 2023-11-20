const getJoyValidation = (target) => {
  const joyMatching = {
    VARCHAR: `body("${target.label}${mandatory ? 'notEmpty()': ''}.isLength({ max: ${target.long}})),\n`,
    TYNIINT: `body("${target.label}${mandatory ? 'notEmpty()': ''}.isNumerical(),\n`,
    INT: `body("${target.label}${mandatory ? 'notEmpty()': ''}.isNumerical(),\n`,
    DATE: `body("${target.label}${mandatory ? 'notEmpty()': ''}.isDate(),\n`,
    DATETIME: `body("${target.label}${mandatory ? 'notEmpty()': ''}.isIso8601().toDate(),\n`,
    LONGTEXT: `body("${target.label}${mandatory ? 'notEmpty()': ''},\n`,
    TEXT: `body("${target.label}${mandatory ? 'notEmpty()': ''},\n`,
  }
  return joyMatching[target.type];
}
const getExpressValidation = (target) => {
  const expressMatching = {
    VARCHAR: `body("${target.fieldName}")${target.mandatory ? '.notEmpty()': ''}.isLength({ max: ${target.long}})),\n`,
    TYNIINT: `body("${target.fieldName}")${target.mandatory ? '.notEmpty()': ''}.isNumerical(),\n`,
    INT: `body("${target.fieldName}")${target.mandatory ? '.notEmpty()': ''}.isNumerical(),\n`,
    DATE: `body("${target.fieldName}")${target.mandatory ? '.notEmpty()': ''}.isDate(),\n`,
    DATETIME: `body("${target.fieldName}")${target.mandatory ? '.notEmpty()': ''}.isIso8601().toDate(),\n`,
    LONGTEXT: `body("${target.fieldName}")${target.mandatory ? '.notEmpty()': ''},\n`,
    TEXT: `body("${target.fieldName}")${target.mandatory ? '.notEmpty()': ''},\n`,
  }
  return expressMatching[target.fieldType];
}

const getProxy = (validator) => {
  return {
  get: function (target, prop, receiver) {
    if (prop === 'validation') {
      console.log(target)
      const validSystem = {
        "Joi": () => getJoyValidation(target),
        "express-validator":() => getExpressValidation(target),
        "none": () => "No field validation"
      }
      return validSystem[validator]()
    }
    if (prop === "sql") {
      return "SQL TO CREATE FIELD"
    }
    return Reflect.get(...arguments);
  },
};
}

module.exports = { getProxy };