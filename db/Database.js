const Table = require("./Table");

class Database {
  constructor() {
    this.tables = {}; // { tableName: Table }
  }

  execute(command) {
    switch (command.type) {
      case "CREATE_TABLE":
  if (this.tables[command.tableName]) {
    throw new Error(`Table ${command.tableName} already exists`);
  }

  this.tables[command.tableName] = new Table(
    command.tableName,
    command.columns, // PASS full objects {name, type, primary, unique}
    command.columns.filter(c => c.primary).map(c => c.name),
    command.columns.filter(c => c.unique).map(c => c.name)
  );

  return `Table ${command.tableName} created.`;

      case "INSERT":
        this._getTable(command.tableName).insert(command.values);
        return "Row inserted.";

      case "SELECT":
  if (command.join) {
    const tableA = this._getTable(command.tableName);
    const tableB = this._getTable(command.join.table);
    const result = [];

    for (let rowA of tableA.rows) {
      for (let rowB of tableB.rows) {
        // JOIN condition
        if (rowA[command.join.on.left] === rowB[command.join.on.right]) {
          const merged = { ...rowA, ...rowB };

          // WHERE filtering
          let wherePass = true;
          if (command.where) {
            const { column, value } = command.where;
            wherePass = merged[column] === value;
          }

          if (!wherePass) continue;

          // select specific columns
          if (command.columns[0] === "*") {
            result.push(merged);
          } else {
            const obj = {};
            for (let col of command.columns) {
              obj[col] = merged[col];
            }
            result.push(obj);
          }
        }
      }
    }

    return result;
  } else {
    return this._getTable(command.tableName).select(command.columns, command.where);
  }


      case "UPDATE":
        return this._getTable(command.tableName).update(command.set, command.where);

      case "DELETE":
        return this._getTable(command.tableName).delete(command.where);

      default:
        throw new Error(`Unsupported command type: ${command.type}`);
    }
  }

  _getTable(tableName) {
    const table = this.tables[tableName];
    if (!table) throw new Error(`Table ${tableName} does not exist`);
    return table;
  }
}

module.exports = Database;
