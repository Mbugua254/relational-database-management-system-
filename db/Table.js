class Table {
  constructor(name, columns, primaryKeys = [], uniqueKeys = []) {
    this.name = name;
    
    // columns should be full objects: {name, type, primary, unique}
    this.columns = columns; 

    // convenience map for fast access
    this.columnMap = {};
    for (const col of columns) {
      this.columnMap[col.name] = col;
    }

    this.primaryKeys = primaryKeys; // array of column names
    this.uniqueKeys = uniqueKeys;   // array of column names

    this.rows = [];
  }

  insert(values) {
    if (values.length !== this.columns.length) {
      throw new Error("Column count mismatch");
    }

    const row = {};

    for (let i = 0; i < this.columns.length; i++) {
      const col = this.columns[i];
      let value = values[i];

      // Convert INT columns
      if (col.type.toUpperCase() === "INT") {
        value = Number(value);
      }

      row[col.name] = value;
    }

    // enforce PRIMARY KEY
    for (const key of this.primaryKeys) {
      if (this.rows.some(r => r[key] === row[key])) {
        throw new Error(`Duplicate primary key value for ${key}`);
      }
    }

    // enforce UNIQUE
    for (const key of this.uniqueKeys) {
      if (this.rows.some(r => r[key] === row[key])) {
        throw new Error(`Duplicate unique value for ${key}`);
      }
    }

    this.rows.push(row);
  }

  select(columns) {
    if (columns.length === 1 && columns[0] === "*") return this.rows;

    return this.rows.map(row => {
      const obj = {};
      for (let col of columns) obj[col] = row[col];
      return obj;
    });
  }

  update(set, where) {
  let updated = 0;

  for (let row of this.rows) {
    if (row[where.column] == where.value) {
      row[set.column] = set.value;
      updated++;
    }
  }

  // Rebuild indexes after update
  for (let colName in this.indexes) {
    this.indexes[colName].clear();
    for (let row of this.rows) {
      this.indexes[colName].set(row[colName], row);
    }
  }

  return `${updated} row(s) updated.`;
}


  delete(where) {
    const initial = this.rows.length;

    // Type-aware comparison
    this.rows = this.rows.filter(row => {
      let rowValue = row[where.column];
      let compareValue = where.value;
      if (typeof rowValue === "number") compareValue = Number(where.value);
      return rowValue !== compareValue;
    });

    // Rebuild indexes
    for (let colName in this.indexes) {
      this.indexes[colName].clear();
      for (let row of this.rows) this.indexes[colName].set(row[colName], row);
    }

    return `${initial - this.rows.length} row(s) deleted.`;
  }
}

module.exports = Table;
