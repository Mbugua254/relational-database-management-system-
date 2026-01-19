class Parser {
  constructor() {
    // Define keywords for the SQL subset
    this.keywords = [
      "CREATE", "TABLE", "PRIMARY", "KEY", "UNIQUE",
      "INSERT", "INTO", "VALUES",
      "SELECT", "FROM", "WHERE", "INNER", "JOIN", "ON",
      "UPDATE", "SET",
      "DELETE"
    ];
  }

  /**
   * Tokenize SQL string into an array of tokens
   * @param {string} input
   * @returns {string[]} tokens
   */
  tokenize(input) {
  // Remove semicolon at the end
  input = input.trim().replace(/;$/, "");

  // Split by spaces, parentheses, commas, equal signs
  const regex = /(\s+|[(),=])/g;

  // Split, trim, remove empty strings
  let tokens = input.split(regex)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  // Uppercase keywords only
  tokens = tokens.map(t => this.keywords.includes(t.toUpperCase()) ? t.toUpperCase() : t);

  return tokens;
}

  /**
   * Parse tokens into a structured command object
   * @param {string} sql
   * @returns {object} parsed command
   */
  parse(sql) {
    const tokens = this.tokenize(sql);
    if (tokens.length === 0) return null;

    const commandType = tokens[0];
    switch (commandType) {
      case "CREATE":
        return this.parseCreateTable(tokens);
      case "INSERT":
        return this.parseInsert(tokens);
      case "SELECT":
        return this.parseSelect(tokens);
      case "UPDATE":
        return this.parseUpdate(tokens);
      case "DELETE":
        return this.parseDelete(tokens);
      default:
        throw new Error(`Unknown command: ${commandType}`);
    }
  }

  parseCreateTable(tokens) {
    // Example: CREATE TABLE users (id INT PRIMARY KEY, email TEXT UNIQUE, name TEXT)
    if (tokens[1] !== "TABLE") throw new Error("Expected TABLE after CREATE");

    const tableName = tokens[2];
    const columns = [];

    let i = 4; // Skip '('
    while (i < tokens.length && tokens[i] !== ")") {
      let colName = tokens[i];
      let type = tokens[i + 1];
      let primary = false;
      let unique = false;

      if (tokens[i + 2] === "PRIMARY" && tokens[i + 3] === "KEY") {
        primary = true;
        i += 2;
      } else if (tokens[i + 2] === "UNIQUE") {
        unique = true;
        i += 1;
      }

      columns.push({ name: colName, type, primary, unique });

      i += 2; // Move past type
      if (tokens[i] === ",") i++; // Skip comma
    }

    return { type: "CREATE_TABLE", tableName, columns };
  }

  parseInsert(tokens) {
    // INSERT INTO users VALUES (1, 'a@test.com', 'Alice')
    if (tokens[1] !== "INTO") throw new Error("Expected INTO after INSERT");

    const tableName = tokens[2];

    const valuesStart = tokens.indexOf("(");
    const valuesEnd = tokens.indexOf(")");
    if (valuesStart === -1 || valuesEnd === -1) throw new Error("Expected parentheses for VALUES");

    const values = tokens.slice(valuesStart + 1, valuesEnd)
      .filter(t => t !== ",")
      .map(t => {
        // Convert numbers if INT, leave strings as-is (quotes stripped later)
        if (!isNaN(t)) return Number(t);
        return t.replace(/^['"]|['"]$/g, ""); // Remove quotes
      });

    return { type: "INSERT", tableName, values };
  }

  parseSelect(tokens) {
    // For simplicity, only handle SELECT * or SELECT col1, col2 FROM table
    const fromIndex = tokens.indexOf("FROM");
  if (fromIndex === -1) throw new Error("Expected FROM in SELECT");

  const columns = tokens.slice(1, fromIndex).filter(t => t !== ",");

  const tableName = tokens[fromIndex + 1];

  const joinIndex = tokens.indexOf("INNER");
  let join = null;

  if (joinIndex !== -1) {
    const joinTable = tokens[joinIndex + 2]; // table after JOIN
    const onIndex = tokens.indexOf("ON");
    const leftCol = tokens[onIndex + 1].split(".")[1]; // table.col -> col
    const rightCol = tokens[onIndex + 3].split(".")[1];

    join = { table: joinTable, on: { left: leftCol, right: rightCol } };
  }

  return { type: "SELECT", tableName, columns, join };
}

  parseUpdate(tokens) {
    // UPDATE table_name SET column = value WHERE column = value
    const tableName = tokens[1];
    const setIndex = tokens.indexOf("SET");
    const whereIndex = tokens.indexOf("WHERE");

    const setCol = tokens[setIndex + 1];
    const setVal = tokens[setIndex + 3].replace(/^['"]|['"]$/g, "");

    const whereCol = tokens[whereIndex + 1];
    const whereVal = tokens[whereIndex + 3].replace(/^['"]|['"]$/g, "");

    return {
      type: "UPDATE",
      tableName,
      set: { column: setCol, value: setVal },
      where: { column: whereCol, value: whereVal }
    };
  }

  parseDelete(tokens) {
    // DELETE FROM table_name WHERE column = value
    const tableName = tokens[2];
    const whereIndex = tokens.indexOf("WHERE");
    const whereCol = tokens[whereIndex + 1];
    const whereVal = tokens[whereIndex + 3].replace(/^['"]|['"]$/g, "");

    return {
      type: "DELETE",
      tableName,
      where: { column: whereCol, value: whereVal }
    };
  }
}

module.exports = Parser;
