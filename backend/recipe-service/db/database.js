//opens FoodForge SQLite database

//use everywhere the backend needs the database so every connection is set up the same way
//does not delete data each run, database can be reset by running 'npm run db:reset'
//requires Node 22.13+

const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const DB_PATH = path.join(__dirname, "foodforge.db");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

//columns added after the first version of schema.sql.
//"CREATE TABLE IF NOT EXISTS" never changes a table that already exists, so databases made before
//these columns existed get them added here (keeps everyone's saved data, no reset needed)
const ADDED_COLUMNS = [
    ["INGREDIENT", "isStaple", "INTEGER NOT NULL DEFAULT 0 CHECK (isStaple IN (0, 1))"],
    ["CUISINE", "imageURL", "TEXT"],
    ["DIET", "imageURL", "TEXT"],
    ["FLAVORPROFILE", "imageURL", "TEXT"],
];

function addMissingColumns(db) {
    for (const [table, column, definition] of ADDED_COLUMNS) {
        const columns = db.prepare(`PRAGMA table_info(${table})`).all();
        if (!columns.some((c) => c.name === column)) {
            db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
        }
    }
}

function openDatabase() {
    const db = new DatabaseSync(DB_PATH);
    db.exec("PRAGMA foreign_keys = ON;");
    db.exec(fs.readFileSync(SCHEMA_PATH, "utf8"));
    addMissingColumns(db);
    return db;
}

module.exports = { openDatabase, DB_PATH };
