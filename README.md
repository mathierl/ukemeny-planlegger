# Ukemeny Planlegger

A weekly menu planner for people with celiac disease (gluten-free) and dairy
protein allergy (melkefri). Pick recipes, build out a week's menu, and see
the total grocery cost for that week. The UI is in Norwegian.

All data is stored locally in the browser (`localStorage`) — nothing is sent
to a backend server except calls to the [Kassal](https://kassal.app) grocery
price API for product/price lookups.

## Stack

- [Create React App](https://github.com/facebook/create-react-app) (react-scripts), React 19
- React Router for navigation
- Tailwind CSS for styling
- No backend — this is a client-only app

## Getting started

Install dependencies:

```bash
npm install --legacy-peer-deps
```

The `--legacy-peer-deps` flag is required because of a peer dependency
mismatch between React 19 and the current `@testing-library/react` version.

Copy `.env.example` to `.env` and fill in your Kassal API key:

```bash
cp .env.example .env
```

This key is required for grocery price lookups (see `src/KassalApiService.js`
and `src/config.js`). Get a key from [kassal.app](https://kassal.app).

Optionally, add a [Groq](https://console.groq.com/keys) API key
(`REACT_APP_GROQ_API_KEY`) to enable AI-powered "similar recipes" and recipe
suggestions (see `src/RecipeAIService.js`). This is optional — without it,
similar recipes falls back to local tag/ingredient similarity scoring, and
the "suggest a new recipe" feature is hidden.

Then start the dev server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available scripts

This project uses the standard Create React App scripts (`npm start`,
`npm test`, `npm run build`, `npm run eject`) — see the
[CRA documentation](https://facebook.github.io/create-react-app/docs/getting-started)
for details on each.
