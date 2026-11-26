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

(npm run seed must be run before the first start, and again after
catalog.js or recipes.js changes. The backend will not start on an empty database.)

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
FoodForge uses a SQLite database stored at `backend/recipe-service/db/foodforge.db`. The file
is not committed to git; each person builds their own copy with `npm run seed`.
No database server or extra install is needed.

Files in `backend/recipe-service/db/`:
- `schema.sql` - table definitions. Safe to run repeatedly; it only creates missing tables.
- `database.js` - `openDatabase()` opens the database with foreign keys on, creates any missing tables,
  and adds columns that older databases are missing. Use it for all database access.
- `catalog.js` - starter ingredients (by category), pantry staples, cuisines, diets, and flavors.
- `recipes.js` - starter recipes. Add or edit recipes here (instructions are at the top of the file).
- `options.js` - `getOptions(db)` builds the list of selectable options from the database.
- `search.js` - `findRecipes()` finds recipes matching the user's selections.
- `seed.js` - adds or updates everything in `catalog.js`, then adds or updates the recipes from `recipes.js`.
- `reset.js` - deletes the database file (used by `npm run db:reset`).

Commands (run from the `backend/recipe-service` folder):
- `npm run seed` - creates the database if needed and adds/updates starter data.
  Never deletes anything, including AI-generated recipes.
- `npm run db:reset` - deletes the database and rebuilds it from scratch.
  **This also deletes any saved AI-generated recipes.** Stop the backend first.

Notes:
- The database is the source of truth for the options in the app. The recipe service's `GET /options` returns them
  (`GET /api/options` through the API gateway), and `POST /recipe/search` validates selections against the database.
- Macro goal ranges are filter rules rather than records, so they live in `backend/recipe-service/config/macros.js`
  (used for both the options list and recipe search).
- Recipe macros are per serving: calories in kcal; protein, fat, and carbs in grams.
- Recipes list every ingredient they use. Pantry staples (oil, salt, pepper, spices, sugar, etc.)
  are stored as ingredients with `isStaple = 1`. They are never shown as options, and recipe
  search ignores them (users are assumed to have them).
- Each option's `img` in `catalog.js` is a path under `frontend/public/images`. Images still needed:
  onion.svg, tomato.svg, garlic.svg, lime.svg, soy-sauce.svg, bbq-sauce.svg, broth.svg, coconut-milk.svg
  (rename the paths in `catalog.js` if the real files use different names, then run `npm run seed`).
- Each recipe has a `source` of `seed` (from recipes.js) or `ai` (AI-generated and saved).
- Node prints an "SQLite is an experimental feature" warning. This is expected and harmless.

## Current scope
Ingredient selection, preference collection, validation, and frontend-backend communication are implemented.
The app's selectable options and recipe search are served from the SQLite database.
Recipe search and AI generation are planned for Phase III.