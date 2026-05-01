# AGENTS.md

## Commands

- `npm run serve` - Dev server (Vue CLI)
- `npm run build` - Production build to `dist/`
- `npm run test:unit` - Run Jest tests (Vue CLI preset)
- `npm run lint` - Lint with ESLint + Prettier

## Architecture

- **Entry**: `src/main.js` → mounts App, dispatches `initSpots` and `initTheme`
- **State**: `src/store/index.js` uses Vuex with Firebase real-time sync via `onValue` listener on `Garage` ref
- **Router**: `src/router/index.js` uses `createWebHistory` with `process.env.BASE_URL`
- **Firebase config**: `src/firebase/config.js`

## Critical Config

- **`vue.config.js`**: `publicPath: "/parking-project/"` — required for GitHub Pages deployment; changing this breaks deploy
- **`jsconfig.json`**: `@/*` aliases to `src/*`
- **Jest**: Uses `@vue/cli-plugin-unit-jest` preset; test files in `tests/unit/` with `.spec.{js,ts}` extension

## Firebase Structure

```
Garage/
├── Floor1/  (spots A1-A5)
├── Floor2/  (spots B1-B5)
└── Floor3/  (spots C1-C5)
```

Spot status: `0`=free, `1`=occupied, `2`=reserved, `3`=maintenance

## Deployment

- GitHub Pages via `.github/workflows/deploy.yml`
- Auto-deploys on push to `main`
- CI uses `npm ci` + `npm run build`, deploys `./dist`
- Node 20 in CI

## Linting Rules

- ESLint extends `plugin:vue/vue3-essential` + `eslint:recommended`
- `vue/multi-word-component-names` is disabled
- Prettier integration enabled
- Parser: `@babel/eslint-parser`

## Notes

- No TypeScript — plain JavaScript
- No typecheck command in scripts
- Sass/SCSS supported (sass-loader + sass installed)
- Firebase v12+ (modular API: `ref`, `onValue` from `firebase/database`)
