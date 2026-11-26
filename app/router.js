// router.js — hash routing and one render function per section.
// The nav links are ordinary hash links (#/population …); the router reads
// the hash, renders that section into #view, draws its charts, and marks
// the matching nav link active.

import { COUNTRY, HEADLINE, POPULATION, GDP_GROWTH, GDP_SECTORS, UNEMPLOYMENT, POVERTY, INFLATION, PROVINCES, SOURCES } from './data.js';
import { drawBarChart, drawLineChart, drawRankedBars, CHART_COLORS } from './charts.js';

const VIEW = () => document.getElementById('view');

function sourceLine(source) {
  return `<p class="source">Source: ${source}</p>`;
}

function card(item) {
  return `<article class="card"><p class="card-label">${item.label}</p><p class="card-value">${item.value}</p><p class="card-detail">${item.detail}</p><p class="card-source">${item.source}</p></article>`;
}

function factList(items) {
  return '<ul class="facts">' + items.map((f) =>
    `<li><span>${f.label}</span><strong>${f.value}</strong><em>${f.source}</em></li>`).join('') + '</ul>';
}

function yearTable(years, values, unit, source) {
  const rows = years.map((y, i) => `<tr><td>${y}</td><td>${values[i]}</td></tr>`).join('');
  return `<table class="data-table"><caption>${unit}</caption><thead><tr><th>Year</th><th>Value</th></tr></thead><tbody>${rows}</tbody></table>${sourceLine(source)}`;
}

function renderOverview() {
  return `
  <section class="hero">
    <p class="kicker">National statistics · ${COUNTRY.name}</p>
    <h1>Indonesia in numbers</h1>
    <p class="lede">The headline figures for the world's fourth most populous country — population, economy, jobs, poverty and prices — each with its source and year, on one page. Pick a section above to dig into the series behind any number.</p>
    <p class="meta-line">Capital ${COUNTRY.capital} · Currency ${COUNTRY.currency} · Land area ${COUNTRY.landAreaKm2.toLocaleString('en-US')} km² <span class="muted">(${COUNTRY.landAreaSource})</span></p>
  </section>
  <div class="card-grid">${HEADLINE.map(card).join('')}</div>
  <section class="panel">
    <h2>At a glance: population 2020–2024</h2>
    <canvas id="chart-population" data-height="240" role="img" aria-label="Bar chart of Indonesia's population, 2020 to 2024"></canvas>
    ${sourceLine(POPULATION.source)}
    <p class="panel-link"><a href="#/population">See the full population section →</a></p>
  </section>
  <section class="panel">
    <h2>Where to look next</h2>
    <ul class="jump-list">
      <li><a href="#/economy">Economy</a> — GDP growth and what each sector contributes.</li>
      <li><a href="#/employment">Employment &amp; poverty</a> — who works, who is out of work, and how poverty is falling.</li>
      <li><a href="#/prices">Prices &amp; inflation</a> — the consumer price story, 2021 to 2024.</li>
      <li><a href="#/provinces">Provinces</a> — the ten most populous provinces, searchable and sortable.</li>
      <li><a href="#/sources">Data &amp; sources</a> — every figure's publisher and vintage.</li>
    </ul>
  </section>`;
}

function renderPopulation() {
  return `
  <section class="panel">
    <h1>Population</h1>
    <p class="lede">Indonesia's population passed 281 million in 2024. Growth has slowed to under 1% a year as fertility falls, and nearly three in five Indonesians now live in towns and cities.</p>
    <div class="control-row">
      <label for="pop-unit">Show values as</label>
      <select id="pop-unit">
        <option value="millions" selected>Millions of people</option>
        <option value="people">People</option>
      </select>
    </div>
    <canvas id="chart-population" data-height="280" role="img" aria-label="Line chart of Indonesia's population, 2020 to 2024"></canvas>
    ${sourceLine(POPULATION.source)}
  </section>
  <section class="panel">
    <h2>Population in detail</h2>
    ${factList(POPULATION.notes)}
    ${yearTable(POPULATION.years, POPULATION.values, 'Population, ' + POPULATION.unit, POPULATION.source)}
  </section>`;
}

function renderEconomy() {
  return `
  <section class="panel">
    <h1>Economy</h1>
    <p class="lede">Indonesia is the world's 16th largest economy. Growth held above 5% in 2022, 2023 and 2024, and GDP per capita reached US$ 4,925 in 2024.</p>
    <h2>Real GDP growth</h2>
    <canvas id="chart-gdp-growth" data-height="260" role="img" aria-label="Bar chart of real GDP growth, 2021 to 2024"></canvas>
    ${sourceLine(GDP_GROWTH.source)}
    ${yearTable(GDP_GROWTH.years, GDP_GROWTH.values.map((v) => v.toFixed(2) + '%'), GDP_GROWTH.unit, GDP_GROWTH.source)}
  </section>
  <section class="panel">
    <h2>What makes up GDP, 2024</h2>
    <p class="lede">Manufacturing is the single largest sector, ahead of trade and agriculture. The chart shows each sector's share of GDP.</p>
    <canvas id="chart-sectors" data-height="340" role="img" aria-label="Bar chart of GDP by sector, 2024"></canvas>
    ${sourceLine(GDP_SECTORS.source)}
  </section>`;
}

function renderEmployment() {
  return `
  <section class="panel">
    <h1>Employment &amp; poverty</h1>
    <p class="lede">Unemployment has fallen every year since 2021, and the poverty rate dropped below 9% in 2024 — the lowest in the series.</p>
    <h2>Open unemployment rate</h2>
    <canvas id="chart-unemployment" data-height="260" role="img" aria-label="Line chart of the open unemployment rate, 2021 to 2024"></canvas>
    ${sourceLine(UNEMPLOYMENT.source)}
    ${factList(UNEMPLOYMENT.extras)}
    <h2>Poverty rate</h2>
    <canvas id="chart-poverty" data-height="260" role="img" aria-label="Line chart of the poverty rate, 2021 to 2024"></canvas>
    ${sourceLine(POVERTY.source)}
    ${factList(POVERTY.extras)}
  </section>`;
}

function renderPrices() {
  return `
  <section class="panel">
    <h1>Prices &amp; inflation</h1>
    <p class="lede">Consumer price inflation spiked to 5.51% in 2022 and eased back to 1.57% by 2024 — the calmest year in the series.</p>
    <canvas id="chart-inflation" data-height="280" role="img" aria-label="Bar chart of consumer price inflation, 2021 to 2024"></canvas>
    ${sourceLine(INFLATION.source)}
    ${yearTable(INFLATION.years, INFLATION.values.map((v) => v.toFixed(2) + '%'), INFLATION.unit, INFLATION.source)}
    <h2>Reading the series</h2>
    ${factList(INFLATION.notes)}
  </section>`;
}

function provinceRows(rows) {
  return rows.map((r) =>
    `<tr><td>${r.name}</td><td>${r.population.toFixed(2)}</td><td>${r.capital}</td></tr>`).join('');
}

function renderProvinces() {
  return `
  <section class="panel">
    <h1>Provinces</h1>
    <p class="lede">More than a third of Indonesians live on Java's three big provinces. West Java alone, at 50.35 million people, is larger than most countries.</p>
    <canvas id="chart-provinces" data-height="320" role="img" aria-label="Ranked bar chart of the ten most populous provinces, 2024"></canvas>
    ${sourceLine(PROVINCES.source)}
  </section>
  <section class="panel">
    <h2>Ten most populous provinces, 2024</h2>
    <div class="control-row">
      <label for="province-search">Search provinces</label>
      <input id="province-search" type="search" placeholder="Type a province name…" autocomplete="off">
      <label for="province-sort">Sort by</label>
      <select id="province-sort">
        <option value="population" selected>Population, largest first</option>
        <option value="name">Name, A to Z</option>
      </select>
    </div>
    <table class="data-table" id="province-table">
      <thead><tr><th>Province</th><th>Population (millions)</th><th>Capital</th></tr></thead>
      <tbody id="province-body">${provinceRows(PROVINCES.rows)}</tbody>
    </table>
    <p class="source" id="province-count">${PROVINCES.rows.length} provinces shown. ${PROVINCES.source}</p>
  </section>`;
}

function renderSources() {
  return `
  <section class="panel">
    <h1>Data &amp; sources</h1>
    <p class="lede">Every figure on this site names its publisher and year where it appears. The full list is below. Figures are shown as published; nothing is estimated by this site.</p>
    <table class="data-table">
      <thead><tr><th>Publisher</th><th>What it supplied</th><th>Where to check</th></tr></thead>
      <tbody>${SOURCES.map((s) => `<tr><td>${s.publisher}</td><td>${s.what}</td><td>${s.where}</td></tr>`).join('')}</tbody>
    </table>
    <h2>How to read the figures</h2>
    <ul class="facts">
      <li><span>Population</span><strong>Mid-year estimates</strong><em>BPS; the 2020 figure is the census count.</em></li>
      <li><span>Poverty</span><strong>September round each year</strong><em>BPS; the national poverty line, not the World Bank's.</em></li>
      <li><span>Unemployment</span><strong>August round each year</strong><em>BPS Sakernas; open unemployment as a share of the labour force.</em></li>
      <li><span>Sector shares</span><strong>Rounded to one decimal</strong><em>BPS national accounts 2024; shares sum to 100%.</em></li>
    </ul>
    <p class="source">Site compiled November 2026. Figures are the latest published values available at that date.</p>
  </section>`;
}

const ROUTES = {
  overview: { render: renderOverview, draw: drawOverviewCharts, title: 'Overview' },
  population: { render: renderPopulation, draw: drawPopulationCharts, title: 'Population' },
  economy: { render: renderEconomy, draw: drawEconomyCharts, title: 'Economy' },
  employment: { render: renderEmployment, draw: drawEmploymentCharts, title: 'Employment & Poverty' },
  prices: { render: renderPrices, draw: drawPricesCharts, title: 'Prices & Inflation' },
  provinces: { render: renderProvinces, draw: drawProvincesCharts, title: 'Provinces' },
  sources: { render: renderSources, draw: () => {}, title: 'Data & Sources' },
};

function drawOverviewCharts() {
  const canvas = document.getElementById('chart-population');
  if (canvas) drawBarChart(canvas, { labels: POPULATION.years.map(String), values: POPULATION.values, unit: POPULATION.unit, highlightLast: true });
}

function drawPopulationCharts() {
  const canvas = document.getElementById('chart-population');
  const select = document.getElementById('pop-unit');
  if (!canvas) return;
  const asPeople = select && select.value === 'people';
  drawLineChart(canvas, {
    labels: POPULATION.years.map(String),
    values: asPeople ? POPULATION.values.map((v) => Math.round(v * 1000000)) : POPULATION.values,
    unit: asPeople ? 'people' : POPULATION.unit,
    color: CHART_COLORS.teal,
  });
  if (select && !select.dataset.wired) {
    select.dataset.wired = '1';
    select.addEventListener('change', drawPopulationCharts);
  }
}

function drawEconomyCharts() {
  const growth = document.getElementById('chart-gdp-growth');
  if (growth) drawBarChart(growth, { labels: GDP_GROWTH.years.map(String), values: GDP_GROWTH.values, unit: GDP_GROWTH.unit, color: CHART_COLORS.amber, highlightLast: true });
  const sectors = document.getElementById('chart-sectors');
  const shortNames = {
    'Agriculture, forestry & fishing': 'Agriculture',
    'Mining & quarrying': 'Mining',
    'Public administration': 'Public admin.',
    'Finance & insurance': 'Finance',
    'Information & communication': 'Info & comm.',
    'Transportation & storage': 'Transport',
    'Accommodation & food': 'Accommodation',
  };
  if (sectors) drawRankedBars(sectors, { rows: GDP_SECTORS.sectors, valueOf: (s) => s.share, labelOf: (s) => shortNames[s.name] || s.name, unit: GDP_SECTORS.unit });
}

function drawEmploymentCharts() {
  const unemp = document.getElementById('chart-unemployment');
  if (unemp) drawLineChart(unemp, { labels: UNEMPLOYMENT.years.map(String), values: UNEMPLOYMENT.values, unit: UNEMPLOYMENT.unit, color: CHART_COLORS.coral });
  const poverty = document.getElementById('chart-poverty');
  if (poverty) drawLineChart(poverty, { labels: POVERTY.years.map(String), values: POVERTY.values, unit: POVERTY.unit, color: CHART_COLORS.teal });
}

function drawPricesCharts() {
  const canvas = document.getElementById('chart-inflation');
  if (canvas) drawBarChart(canvas, { labels: INFLATION.years.map(String), values: INFLATION.values, unit: INFLATION.unit, color: CHART_COLORS.coral, highlightLast: true });
}

function drawProvincesCharts() {
  const canvas = document.getElementById('chart-provinces');
  if (canvas) drawRankedBars(canvas, { rows: PROVINCES.rows, valueOf: (r) => r.population, labelOf: (r) => r.name, unit: PROVINCES.unit });
  const search = document.getElementById('province-search');
  const sort = document.getElementById('province-sort');
  const body = document.getElementById('province-body');
  const count = document.getElementById('province-count');
  if (!search || !sort || !body) return;
  const apply = () => {
    const q = search.value.trim().toLowerCase();
    let rows = PROVINCES.rows.filter((r) => r.name.toLowerCase().includes(q));
    if (sort.value === 'name') rows = [...rows].sort((a, b) => a.name.localeCompare(b.name));
    else rows = [...rows].sort((a, b) => b.population - a.population);
    body.innerHTML = provinceRows(rows);
    count.textContent = `${rows.length} of ${PROVINCES.rows.length} provinces shown. ${PROVINCES.source}`;
  };
  search.addEventListener('input', apply);
  sort.addEventListener('change', apply);
}

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return ROUTES[hash] ? hash : 'overview';
}

function render() {
  const key = currentRoute();
  const route = ROUTES[key];
  VIEW().innerHTML = route.render();
  document.title = `${route.title} — NusaData: Statistik Indonesia`;
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#/' + key);
    if (a.getAttribute('href') === '#/' + key) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  route.draw();
  window.scrollTo(0, 0);
}

// Redraw charts when the window is resized so they fit the new width.
let resizeTimer = null;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const key = currentRoute();
    ROUTES[key].draw();
  }, 150);
}

export function startRouter() {
  window.addEventListener('hashchange', render);
  window.addEventListener('resize', onResize);
  render();
}
