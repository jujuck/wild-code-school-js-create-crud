const fs = require("node:fs");

const mustache = require("mustache");

const constructController = (table) => {
  const template = fs.readFileSync(__dirname + "/controllers.mustache", "utf8");

  return mustache.render(template, { table });
};

module.exports = constructController;
