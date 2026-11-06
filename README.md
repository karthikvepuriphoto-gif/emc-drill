# EMC Drill

Learn-then-quiz PWA for NCEE Labs. Seven topics: radiated emissions, conducted emissions, ESD, radiated immunity, FCC Part 15, ICES-002/003, and RED / EN 301 489-1 / REDCA TGN 01.

No ads and no account. A nickname, learn progress, and scores stay on the device (IndexedDB, with a localStorage copy).

## Scripts

```bash
npm install
npm test      # regenerate banks from scripts/ and validate them
npm run dev   # http://localhost:5173/emc-drill/
npm run build
```

Question banks live in `src/data/questions/` and learn cards in `src/data/learn/`. They are produced by `scripts/generate.mjs`. The suggestion form URL is `SUGGESTION_FORM_URL` in `src/config.ts`.

GitHub Pages publishes `dist/` from `.github/workflows/pages.yml` at `https://karthikvepuriphoto-gif.github.io/emc-drill/`.
