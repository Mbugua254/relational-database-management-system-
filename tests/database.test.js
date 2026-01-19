const Parser = require("../db/Parser");
const Database = require("../db/Database");

describe("Database + Table Tests", () => {
  let parser;
  let db;

  beforeEach(() => {
    parser = new Parser();
    db = new Database();
  });

  test("CREATE TABLE and INSERT", () => {
    db.execute(parser.parse("CREATE TABLE users (id INT PRIMARY KEY, email TEXT UNIQUE, name TEXT);"));
    const res = db.execute(parser.parse("INSERT INTO users VALUES (1, 'a@test.com', 'Alice');"));
    expect(res).toBe("Row inserted.");
  });

  test("SELECT all rows", () => {
    db.execute(parser.parse("CREATE TABLE users (id INT PRIMARY KEY, email TEXT UNIQUE, name TEXT);"));
    db.execute(parser.parse("INSERT INTO users VALUES (1, 'a@test.com', 'Alice');"));
    db.execute(parser.parse("INSERT INTO users VALUES (2, 'b@test.com', 'Bob');"));

    const rows = db.execute(parser.parse("SELECT * FROM users;"));
    expect(rows).toEqual([
      { id: 1, email: 'a@test.com', name: 'Alice' },
      { id: 2, email: 'b@test.com', name: 'Bob' }
    ]);
  });

  test("PRIMARY KEY constraint enforcement", () => {
    db.execute(parser.parse("CREATE TABLE users (id INT PRIMARY KEY, email TEXT UNIQUE, name TEXT);"));
    db.execute(parser.parse("INSERT INTO users VALUES (1, 'a@test.com', 'Alice');"));
    expect(() => {
      db.execute(parser.parse("INSERT INTO users VALUES (1, 'b@test.com', 'Bob');"));
    }).toThrow("Duplicate value for id");
  });

  test("UNIQUE constraint enforcement", () => {
    db.execute(parser.parse("CREATE TABLE users (id INT PRIMARY KEY, email TEXT UNIQUE, name TEXT);"));
    db.execute(parser.parse("INSERT INTO users VALUES (1, 'a@test.com', 'Alice');"));
    expect(() => {
      db.execute(parser.parse("INSERT INTO users VALUES (2, 'a@test.com', 'Bob');"));
    }).toThrow("Duplicate value for email");
  });

  test("UPDATE row", () => {
    db.execute(parser.parse("CREATE TABLE users (id INT PRIMARY KEY, email TEXT UNIQUE, name TEXT);"));
    db.execute(parser.parse("INSERT INTO users VALUES (1, 'a@test.com', 'Alice');"));
    const res = db.execute(parser.parse("UPDATE users SET name = 'Alice Updated' WHERE id = 1;"));
    expect(res).toBe("1 row(s) updated.");
    const row = db.execute(parser.parse("SELECT * FROM users;"))[0];
    expect(row.name).toBe("Alice Updated");
  });

  test("DELETE row", () => {
    db.execute(parser.parse("CREATE TABLE users (id INT PRIMARY KEY, email TEXT UNIQUE, name TEXT);"));
    db.execute(parser.parse("INSERT INTO users VALUES (1, 'a@test.com', 'Alice');"));
    const res = db.execute(parser.parse("DELETE FROM users WHERE id = 1;"));
    expect(res).toBe("1 row(s) deleted.");
    const rows = db.execute(parser.parse("SELECT * FROM users;"));
    expect(rows.length).toBe(0);
  });
});
