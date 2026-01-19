
# miniSQL In-Memory Relational Database Management System

miniSQL is a **simple, in-memory relational database management system (RDBMS)** built in Node.js. It supports:

- Creating tables with primary and unique keys
- CRUD operations: INSERT, SELECT, UPDATE, DELETE
- Basic INNER JOIN functionality
- An interactive REPL interface
- A RESTful web server for executing SQL queries via HTTP

> **Note:** Data is stored in memory. Restarting the server or REPL will reset all tables and rows.

---

## Table of Contents

- [Features](#features)  
- [Project Structure](#project-structure)  
- [Installation](#installation)  
- [Usage](#usage)  
  - [REPL](#repl)  
  - [Web Server](#web-server)  
- [Examples](#examples)  
- [Testing](#testing)  
- [Future Improvements](#future-improvements)  
- [License](#license)  

---

## Features

- SQL subset support:
  - `CREATE TABLE` with `PRIMARY KEY` and `UNIQUE` constraints  
  - `INSERT INTO` with column value validation  
  - `SELECT` including `INNER JOIN`  
  - `UPDATE` and `DELETE` with `WHERE` conditions
- In-memory tables and rows management
- Interactive REPL mode for testing queries
- RESTful HTTP API for web-based applications

---

## Project Structure

```
relational-database-management-system/
│
├─ db/
│ ├─ Database.js # Manages tables and executes commands
│ ├─ Table.js # Handles rows, CRUD, primary/unique keys
│ ├─ Parser.js # SQL parser for supported commands
│ ├─ Executor.js # Placeholder for future execution logic
│ └─ Index.js # Placeholder for future indexing features
│
├─ tests/
│ ├─ parser.test.js
│ ├─ database.test.js
│ └─ join.test.js
│
├─ repl.js # Interactive miniSQL REPL
├─ server.js # Express web server exposing SQL API
├─ package.json
└─ README.md
```

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/miniSQL.git
cd miniSQL
```

2. Install dependencies:

```bash
npm install
```

---

## Usage

### REPL

Start the interactive miniSQL terminal:

```bash
node repl.js
```

Commands:

```sql
CREATE TABLE users (id INT PRIMARY KEY, name TEXT, email TEXT UNIQUE);
INSERT INTO users VALUES (1, 'Alice', 'alice@test.com');
SELECT * FROM users;
UPDATE users SET name = 'Alice Updated' WHERE id = 1;
DELETE FROM users WHERE id = 1;
```

Exit the REPL with:

```
Ctrl + C
```

---

### Web Server

Start the Express web server:

```bash
node server.js
```

Available endpoints:

- **GET /** â†’ Friendly homepage with usage instructions  
- **POST /query** â†’ Execute SQL commands  

Example with `curl`:

```bash
curl -X POST http://localhost:3000/query -H "Content-Type: application/json" -d '{"sql": "CREATE TABLE users (id INT PRIMARY KEY, name TEXT, email TEXT UNIQUE)"}'
```

- **GET /tables** â†’ List all tables  
- **GET /tables/:name** â†’ List all rows in a table

---

## Examples

Create two tables and insert data:

```bash
curl -X POST http://localhost:3000/query -H "Content-Type: application/json" -d '{"sql": "CREATE TABLE users (id INT PRIMARY KEY, name TEXT, email TEXT UNIQUE)"}'

curl -X POST http://localhost:3000/query -H "Content-Type: application/json" -d '{"sql": "INSERT INTO users VALUES (1, '''Alice''', '''alice@test.com''')"}'

curl -X POST http://localhost:3000/query -H "Content-Type: application/json" -d '{"sql": "INSERT INTO users VALUES (2, '''Bob''', '''bob@test.com''')"}'
```

Select all users:

```bash
curl -X POST http://localhost:3000/query -H "Content-Type: application/json" -d '{"sql": "SELECT * FROM users"}'
```

Perform an INNER JOIN:

```bash
curl -X POST http://localhost:3000/query -H "Content-Type: application/json" -d '{"sql": "SELECT users.name, posts.title FROM users INNER JOIN posts ON users.id = posts.user_id"}'
```

---

## Testing

Run all unit tests with Jest:

```bash
npm test
```

Tests cover:

- Parser functionality  
- CRUD operations in Database and Table  
- JOIN operations  

---

## Future Improvements

- Persistent storage (save tables to disk)  
- Advanced indexing for faster queries  
- Support for more SQL features (LEFT JOIN, ORDER BY, etc.)  
- Transaction support (BEGIN, COMMIT, ROLLBACK)  
- Authentication for web API  

---

## License

MIT License Â© 2026 Mbugua Michael
