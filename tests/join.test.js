const Parser = require("../db/Parser");
const Database = require("../db/Database");

const parser = new Parser();
const db = new Database();

db.execute(parser.parse("CREATE TABLE users (id INT PRIMARY KEY, name TEXT);"));
db.execute(parser.parse("CREATE TABLE posts (id INT PRIMARY KEY, user_id INT, title TEXT);"));

db.execute(parser.parse("INSERT INTO users VALUES (1, 'Alice');"));
db.execute(parser.parse("INSERT INTO users VALUES (2, 'Bob');"));
db.execute(parser.parse("INSERT INTO posts VALUES (1, 1, 'Post A');"));
db.execute(parser.parse("INSERT INTO posts VALUES (2, 2, 'Post B');"));

const result = db.execute(parser.parse(
  "SELECT users.name, posts.title FROM users INNER JOIN posts ON users.id = posts.user_id;"
));

console.log(result);
