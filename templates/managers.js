const { toCapitalize } = require("wild-js-crud/utils/globals");

const constructManager = (table, fields, ) => {
  const listOfFields = fields.map(field => field.fieldName);
  const capitalizeTable = toCapitalize(table);

  return `const AbstractManager = require("./AbstractManager");

class ${capitalizeTable}Manager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "${table}" as configuration
    super({ table: "${table}" });
  }

  // The C of CRUD - Create operation

  async create(${table}) {
    const { ${listOfFields.join(', ')} } = ${table};
    // Execute the SQL INSERT query to add a new ${table} to the "${table}" table
    const [result] = await this.database.query(
      \`insert into \${this.table} (${listOfFields.join(', ')}) values (${"?, ".repeat(listOfFields.length - 1)}?)\`,
      [${listOfFields.join(', ')}]
    );

    // Return the ID of the newly inserted ${table}
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific ${table} by its ID
    const [rows] = await this.database.query(
      \`select * from \${this.table} where id = ?\`,
      [id]
    );

    // Return the first row of the result, which represents the ${table}
    return rows[0];
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all ${table}s from the "${table}" table
    const [rows] = await this.database.query(\`select * from \${this.table}\`);

    // Return the array of ${table}s
    return rows;
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing ${table}

  async update(${table}, id) {
    // Execute the SQL INSERT query to update the row with tie id on the "${table}" table
    const result = await this.database.query(
      \`update \${this.table} set ? where id = ?\`,
      [${table}, id]
    );

    return result;
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an ${table} by its ID
  async delete(id) {
    const result = await this.database.query(
      \`delete from \${this.table} where id = ?\`,
      [id]
    );

    return result;
  }
}

module.exports = ${capitalizeTable}Manager;
`
};

module.exports = constructManager;