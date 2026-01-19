const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const Parser = require("../db/Parser");
const Database = require("../db/Database");

const app = express();
const parser = new Parser();
const db = new Database();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// ---------------------------------
// Homepage
// ---------------------------------
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to miniSQL Web Server!</h1>
    <p>This server lets you execute SQL commands on an in-memory database.</p>
    <p>Use POST <code>/query</code> to execute SQL commands.</p>
    <p>Example JSON body: { "sql": "SELECT * FROM users" }</p>
    <p>Other endpoints:</p>
    <ul>
      <li>GET /tables → list all tables</li>
      <li>GET /tables/:name → list all rows in a table</li>
    </ul>
  `);
});

// ---------------------------------
// Execute SQL command
// ---------------------------------
app.post("/query", (req, res) => {
  const { sql } = req.body;

  if (!sql) return res.status(400).json({ error: "No SQL provided" });

  try {
    const command = parser.parse(sql);
    const result = db.execute(command);
    res.json({ result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------------------
// List all tables
// ---------------------------------
app.get("/tables", (req, res) => {
  res.json({ tables: Object.keys(db.tables) });
});

// ---------------------------------
// List rows of a specific table
// ---------------------------------
app.get("/tables/:name", (req, res) => {
  try {
    const table = db._getTable(req.params.name);
    res.json({ rows: table.rows });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ---------------------------------
// Start server
// ---------------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`miniSQL web server running at http://localhost:${PORT}`);
});
