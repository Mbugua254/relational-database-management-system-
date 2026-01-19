const Parser = require("../db/Parser");

describe("Parser Tests", () => {
  let parser;

  beforeAll(() => {
    parser = new Parser();
  });

  test("CREATE TABLE with PRIMARY KEY and UNIQUE", () => {
    const sql = "CREATE TABLE users (id INT PRIMARY KEY, email TEXT UNIQUE, name TEXT);";
    const result = parser.parse(sql);

    expect(result).toEqual({
      type: "CREATE_TABLE",
      tableName: "users",
      columns: [
        { name: "id", type: "INT", primary: true, unique: false },
        { name: "email", type: "TEXT", primary: false, unique: true },
        { name: "name", type: "TEXT", primary: false, unique: false },
      ],
    });
  });

  test("INSERT INTO table", () => {
    const sql = "INSERT INTO users VALUES (1, 'a@test.com', 'Alice');";
    const result = parser.parse(sql);

    expect(result).toEqual({
      type: "INSERT",
      tableName: "users",
      values: [1, "a@test.com", "Alice"],
    });
  });

  test("SELECT * FROM table", () => {
    const sql = "SELECT * FROM users;";
    const result = parser.parse(sql);

    expect(result).toEqual({
      type: "SELECT",
      tableName: "users",
      columns: ["*"],
      join: null
    });
  });

  test("SELECT specific columns", () => {
    const sql = "SELECT id, name FROM users;";
    const result = parser.parse(sql);

    expect(result).toEqual({
      type: "SELECT",
      tableName: "users",
      columns: ["id", "name"],
      join: null
    });
  });

  test("UPDATE table", () => {
    const sql = "UPDATE users SET name = 'Bob' WHERE id = 1;";
    const result = parser.parse(sql);

    expect(result).toEqual({
      type: "UPDATE",
      tableName: "users",
      set: { column: "name", value: "Bob" },
      where: { column: "id", value: "1" },
    });
  });

  test("DELETE FROM table", () => {
    const sql = "DELETE FROM users WHERE id = 1;";
    const result = parser.parse(sql);

    expect(result).toEqual({
      type: "DELETE",
      tableName: "users",
      where: { column: "id", value: "1" },
    });
  });
});
