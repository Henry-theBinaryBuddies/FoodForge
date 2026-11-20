
//opens FoodForge SQLite database

//use everywhere the backend needs the database so every connection is set up the same way
//does not delete data each run, database can be reset by running 'npm run db:reset'
//requires Node 22.13+

const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const DB_PATH = path.join(__dirname, "foodforge.db");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

function openDatabase() {
    const db = new DatabaseSync(DB_PATH);
    db.exec("PRAGMA foreign_keys = ON;");
    db.exec(fs.readFileSync(SCHEMA_PATH, "utf8"));
    return db;
}

module.exports = { openDatabase, DB_PATH };
