Contributing

This is a small personal/learning project. The main thing that matters here is keeping changes scoped and tested before they merge.

PR-loop

This section is read by the /pr-loop Claude Code skill to configure itself for this repo. If you're a human contributor, it's also just a summary of how we work.

Commit format: Conventional Commits — feat:, fix:, docs:, refactor:, test:, chore:
Gate commands: CI=true npm test -- --watchAll=false && npm run build (there's no separate lint script; npm run build runs CRA's built-in ESLint checks and will fail on lint errors)
Merge authority: human-only — agents must never merge their own or anyone else's PR automatically
Branch convention: <type>/<short-slug>, e.g. docs/real-readme, chore/env-example
Setup note: this repo currently needs npm install --legacy-peer-deps due to a React 19 / @testing-library/react peer dependency mismatch
Running locally
npm install --legacy-peer-deps
npm start
Before opening a PR
CI=true npm test -- --watchAll=false
npm run build