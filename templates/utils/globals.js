/**
 * Met la chaine de caractère avec la première lettre en majuscule
 * @param {string} str
 * @returns string
 */
const toCapitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const setBreak = async () => {
  return await new Promise(resolve => setTimeout(() => {
    console.log('_'.repeat(45) + '\n');
    resolve()
  }, 500));
}

module.exports = {
  toCapitalize,
  setBreak
}