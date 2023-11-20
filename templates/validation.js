const getValidation = (target) => {
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

const constructValidation = (field) => {
  return `const { body, validationResult } = require("express-validator");
${fields.map(field => getValidation(field))}
const validateUser = [

  (req, res, next) => {
    const errors = validationResult(req)



    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

module.exports = validateUser;
`;
};

module.exports = { constructValidation }