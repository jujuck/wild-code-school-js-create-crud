const constructController = require("wild-js-crud/templates/controllers");
const constructManager = require("wild-js-crud/templates/managers");
const manageTables = require("wild-js-crud/templates/tables");
const constructValidation = require("wild-js-crud/templates/validation");
const manageRoutes = require("wild-js-crud/templates/routes");
const manageDatabase = require("wild-js-crud/templates/database");
const manageFakeData = require("wild-js-crud/templates/seed")

module.exports = {
  constructController,
  constructManager,
  manageTables,
  constructValidation,
  manageRoutes,
  manageDatabase,
  manageFakeData
}