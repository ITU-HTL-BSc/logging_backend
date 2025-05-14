const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const dbDir = path.resolve(__dirname, "../db");
const dbFile = path.join(dbDir, "metrics.db");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbFile);

function dbInit(environment) {
  db.serialize(() => {
    db.run(`
            CREATE TABLE IF NOT EXISTS metrics_${environment} (
                id INTEGER PRIMARY KEY,
                total_lines REAL
            )`);
  });
}

function insertMetrics(environment, total_lines) {
  db.serialize(() => {
    db.run(
      `INSERT INTO metrics_${environment}  (total_lines)
            VALUES (?)`,
      [total_lines]
    );
  });
}

module.exports = { dbInit, insertMetrics };
