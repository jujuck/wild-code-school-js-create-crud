/**
 * Met la chaine de caractère avec la première lettre en majuscule
 * @param {string} str
 * @returns string
 */
const toCapitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

module.exports = {
  toCapitalize
}