const constructController = (table) => {
  return `// Import access to database tables
const tables = require("../tables");

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all ${table}s from the database
    const ${table}s = await tables.${table}.readAll();

    // Respond with the ${table}s in JSON format
    res.status(200).json(${table}s);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific ${table} from the database based on the provided ID
    const ${table} = await tables.${table}.read(req.params.id);

    // If the ${table} is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the ${table} in JSON format
    if (${table} == null) {
      res.sendStatus(404);
    } else {
      res.status(200).json(${table});
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
// This operation is not yet implemented
const edit = async (req, res, next) => {
  // Extract the ${table} data from the request body
  const ${table} = req.body;

  try {
    // Insert the ${table} into the database
    await tables.${table}.update(${table}, req.params.id);

    // Respond with HTTP 204 (No Content)
    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the ${table} data from the request body
  const ${table} = req.body;

  try {
    // Insert the ${table} into the database
    const insertId = await tables.${table}.create(${table});

    // Respond with HTTP 201 (Created) and the ID of the newly inserted ${table}
    res.status(201).json({ ...req.body, id: insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
// This operation is not yet implemented
const destroy = async (req, res, next) => {
  // Extract the ${table} data from the request body
  try {
    // Insert the ${table} into the database
    await tables.${table}.delete(req.params.id);

    // Respond with HTTP 204 (No Content)
    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
};
`
}

module.exports = constructController;