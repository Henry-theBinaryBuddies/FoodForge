//deletes the database file, including any ai recipes

// npm run db:reset
//  -deletes the database and reruns the seed

//only use when you want a completely blank database (if something changed in the database structure)

const fs = require("node:fs");
const { DB_PATH } = require("./database");

for (const file of [DB_PATH, `${DB_PATH}-journal`, `${DB_PATH}-wal`, `${DB_PATH}-shm`]) {
    try {
        fs.rmSync(file, { force: true });
    } catch (err) {
        if (err.code === "EBUSY" || err.code === "EPERM") {
            console.error(
                "Could not delete the database because it is in use. " +
                "Stop the backend server (and close any database viewers), then try again."
            );
            process.exit(1);
        }
        throw err;
    }
}

console.log(`Deleted ${DB_PATH}`);
