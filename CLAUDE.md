Ukemeny Planlegger
What this app is

A weekly menu planner for people with celiac disease (gluten-free) and dairy protein allergy (melkefri). Users pick recipes, build out a week's menu, and see the total grocery cost for that week. UI text is in Norwegian.

All data is stored locally in the browser (localStorage) — nothing is sent to a backend server except calls to the Kassal grocery price API.

Stack
Create React App (react-scripts), React 19
React Router for navigation (/, /recipes, /recipes/:id)
Tailwind CSS for styling
No backend — this is a client-only app
Key files
src/App.js — routes and top-level layout
src/UkemenyContext.js — shared app state (React context)
src/UkemenyOverview.js / src/UkeMenyPlanlegger.js — weekly menu view/builder
src/DayRecipeSelector.js — picking a recipe for a given day
src/MenuManager.js — menu CRUD logic
src/RecipeManager.js, RecipeForm.js, RecipeEditForm.js, RecipeDetail.js — recipe CRUD and display
src/RecipeStorageService.js, src/LocalStorageService.js — persistence layer (localStorage)
src/KassalApiService.js — wraps the Kassal grocery price API (kassal.app), used for product/price lookups
src/config.js — reads REACT_APP_KASSAL_API_KEY from env
Conventions
Service classes (KassalApiService, RecipeStorageService, LocalStorageService) use static methods and already wrap calls in try/catch with console.error logging — follow this pattern for new service methods rather than introducing a different error-handling style.
Norwegian is used for user-facing strings; code (variables, comments) is in English.
No existing state management library beyond React Context — don't introduce Redux/Zustand/etc. without discussing it first.
Running locally
npm install --legacy-peer-deps   # needed due to a React 19 / testing-library peer dep mismatch
npm start
Notes for AI agents
This is a small real app, not a toy — changes should be minimal and scoped to the ticket at hand, not opportunistic rewrites.
Ask before adding new dependencies.
Preserve the Norwegian UI strings; don't translate them to English.