# FoodForge Phase II

A React/Express prototype for selecting ingredients, macro goals, and food
preferences. Express validates the selections and returns them to the
frontend for confirmation.

# Requirements
- Node.js 22.13 or newer and npm (the database uses Node's built-in SQLite)
- Keep the frontend and backend folders together.

## Run
Open two terminals in the project root.
Backend:
cd backend
npm ci
npm run seed
npm start

(npm run seed only needs to be run the first time, or after recipes.js or
data.json changes)

Frontend:
cd frontend
npm ci
npm run dev

Open the URL printed by Vite, normally http://localhost:5173
The backend runs on port 4000. Keep both terminals running.

## Test
-Select any ingredients (at least two), proceed to optional preferences
and submit. Confirm that the page displays the server-accepted ingredients
at bottom of page.
- Try continuing with fewer than two ingredients. Confirm a validation message appears.
- Navigate backward and forward. Confirm selections are preserved.
- Submit with no macro or food preferences. Confirm successful server-accepted ingredients message.
- Stop the backend and submit. Confirm an error message appears. Restart it and submit again to confirm recovery.

## Database
FoodForge uses a SQLite database stored at `backend/db/foodforge.db`. The file
is not committed to git; each person builds their own copy with `npm run seed`.
No database server or extra install is needed.

Files in `backend/db/`:
- `schema.sql` - table definitions. Safe to run repeatedly; it only creates missing tables.
- `database.js` - `openDatabase()` opens the database with foreign keys on and creates any missing tables. Use it for all database access.
- `recipes.js` - starter recipes. Add or edit recipes here (instructions are at the top of the file).
- `seed.js` - adds the ingredients, categories, cuisines, diets, and flavors from
  `frontend/src/data/data.json`, then adds or updates the recipes from `recipes.js`.
- `reset.js` - deletes the database file (used by `npm run db:reset`).

Commands (run from the `backend` folder):
- `npm run seed` - creates the database if needed and adds/updates starter data.
  Never deletes anything, including AI-generated recipes.
- `npm run db:reset` - deletes the database and rebuilds it from scratch.
  **This also deletes any saved AI-generated recipes.** Stop the backend first.

Notes:
- Recipe macros are per serving: calories in kcal; protein, fat, and carbs in grams.
- Recipes only link to the ingredients users can select in the app. Pantry
  staples (oil, salt, garlic, spices, etc.) are mentioned in the instructions only.
- Each recipe has a `source` of `seed` (from recipes.js) or `ai` (AI-generated and saved).
- Node prints an "SQLite is an experimental feature" warning. This is expected and harmless.

## Current scope
Ingredient selection, preference collection, validation, and frontend-backend communication are implemented.
The SQLite database (schema, starter recipes, and seed scripts) is set up but not yet connected to the app.
Recipe search and AI generation are planned for Phase III.