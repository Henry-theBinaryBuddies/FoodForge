# FoodForge Phase II

A React/Express prototype for selecting ingredients, macro goals, and food
preferences. Express validates the selections and returns them to the
frontend for confirmation.

# Requirements
- Node.js 22.12 or newer and npm
- Keep the frontend and backend folders together.

## Run
Open two terminals in the project root.
Backend:
cd backend
npm ci
npm start

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

## Current scope
Ingredient selection, preference collection, validation, and frontend-backend communication are implemented.
Database integration, recipe search, and AI generation are planned for Phase III.