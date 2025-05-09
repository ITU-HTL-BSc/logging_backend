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
                exec_time REAL
            )`);
    });
}

function insertMetrics(environment, exec_time) {
    db.serialize(() => {
        db.run(
            `INSERT INTO metrics_${environment}  (exec_time)
            VALUES (?)`,
            [exec_time]
        );
    });
}

module.exports = { dbInit, insertMetrics };
