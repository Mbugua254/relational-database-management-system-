const readline = require("readline");
const Parser = require("../db/Parser");
const Database = require("../db/Database");

const parser = new Parser();
const db = new Database();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "miniSQL> "
});

console.log("Welcome to miniSQL REPL!");
rl.prompt();

rl.on("line", line => {
  try {
    const command = parser.parse(line);
    if (!command) {
      rl.prompt();
      return;
    }
    const result = db.execute(command);
    console.log(result);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
  rl.prompt();
}).on("close", () => {
  console.log("\nExiting miniSQL REPL.");
  process.exit(0);
});
