# NusaData — Statistik Indonesia

A national statistics site for Indonesia, built as plain static files that
run offline in any browser, on desktop and on a phone. No build step, no
network request, no library: the charts are drawn with the site's own
canvas code.

## What it shows

Seven hash-routed sections, each reached from the nav bar:

- **Overview** — headline figures (population, GDP, GDP per capita, growth,
  poverty, unemployment) plus a population chart.
- **Population** — population 2020–2024 with a millions/people unit switch,
  and facts on fertility, urban share, density and life expectancy.
- **Economy** — real GDP growth 2021–2024 and GDP by sector, 2024.
- **Employment & Poverty** — open unemployment and poverty rates, with
  labour-force and poverty-line detail.
- **Prices & Inflation** — CPI inflation 2021–2024 and a short reading of
  the series.
- **Provinces** — the ten most populous provinces as a ranked chart and a
  table you can search and sort.
- **Data & Sources** — every figure's publisher, what it supplied, and how
  to read the figures.

## Sources

Every figure names its source and year where it appears. The figures are
the published values of BPS (Statistics Indonesia) and the World Bank,
cross-checked against Destatis' Statistical Country Profile: Indonesia.
Nothing on the site is estimated by the site itself.

## Files

- `app/index.html` — page shell and navigation
- `app/style.css` — the site's look (system fonts only)
- `app/data.js` — every figure, with source and year
- `app/charts.js` — canvas bar, line and ranked-bar renderers
- `app/router.js` — hash routing and one render function per section
- `app/main.js` — boot
- `main.ts` — entrypoint: copies `app/` and `screenshots/` to the output
  directory and writes `dossier.json` with `buildDossier`
- `screenshots/` — renders of the site taken in headless Chromium

## Run it locally

```sh
python3 -m http.server 8080 --directory app
# open http://localhost:8080/
```

## Hand it in

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see `LICENSE`.
