// data.js — every figure on the site, with its source and year.
// Figures are the published values of BPS (Statistics Indonesia) and the
// World Bank; nothing here is estimated by this site. Values are kept in
// plain numbers so charts and tables always agree with each other.

export const COUNTRY = {
  name: 'Indonesia',
  capital: 'Jakarta',
  currency: 'Rupiah (IDR)',
  landAreaKm2: 1892555,
  landAreaSource: 'World Bank, World Development Indicators, 2024',
};

export const HEADLINE = [
  {
    label: 'Population',
    value: '281.6 million',
    detail: 'Mid-year estimate, 2024',
    source: 'BPS (Statistics Indonesia)',
  },
  {
    label: 'GDP',
    value: 'US$ 1,396 billion',
    detail: 'Current prices, 2024',
    source: 'World Bank',
  },
  {
    label: 'GDP per capita',
    value: 'US$ 4,925',
    detail: 'Current prices, 2024',
    source: 'World Bank',
  },
  {
    label: 'GDP growth',
    value: '5.03%',
    detail: 'Year on year, 2024',
    source: 'BPS',
  },
  {
    label: 'Poverty rate',
    value: '8.57%',
    detail: 'September 2024',
    source: 'BPS',
  },
  {
    label: 'Open unemployment',
    value: '4.91%',
    detail: 'August 2024',
    source: 'BPS',
  },
];

// Mid-year population, millions. Source: BPS population estimates.
export const POPULATION = {
  unit: 'million people',
  source: 'BPS (Statistics Indonesia), mid-year population estimates',
  years: [2020, 2021, 2022, 2023, 2024],
  values: [270.2, 272.7, 275.8, 278.7, 281.6],
  notes: [
    { label: '2020 census count', value: '270.2 million', source: 'BPS, Population Census 2020' },
    { label: 'Fertility rate', value: '2.13 births per woman', source: 'World Bank, 2023' },
    { label: 'Urban population', value: '58.8% of total', source: 'World Bank, 2024' },
    { label: 'Population density', value: '149 people per km²', source: 'World Bank, 2024' },
    { label: 'Life expectancy, women', value: '73.4 years', source: 'World Bank, 2024' },
    { label: 'Life expectancy, men', value: '69.2 years', source: 'World Bank, 2024' },
  ],
};

// Real GDP growth, percent year on year. Source: BPS national accounts.
export const GDP_GROWTH = {
  unit: 'percent, year on year',
  source: 'BPS (Statistics Indonesia), national accounts',
  years: [2021, 2022, 2023, 2024],
  values: [3.69, 5.31, 5.05, 5.03],
};

// Share of GDP by sector, percent, 2024 (rounded). Source: BPS national accounts.
export const GDP_SECTORS = {
  unit: 'percent of GDP',
  source: 'BPS (Statistics Indonesia), national accounts 2024 (shares rounded)',
  sectors: [
    { name: 'Manufacturing', share: 18.7 },
    { name: 'Trade', share: 13.0 },
    { name: 'Agriculture, forestry & fishing', share: 12.5 },
    { name: 'Mining & quarrying', share: 10.5 },
    { name: 'Construction', share: 9.9 },
    { name: 'Public administration', share: 7.9 },
    { name: 'Finance & insurance', share: 4.2 },
    { name: 'Information & communication', share: 4.0 },
    { name: 'Transportation & storage', share: 3.9 },
    { name: 'Education', share: 3.2 },
    { name: 'Accommodation & food', share: 2.6 },
    { name: 'Real estate', share: 2.4 },
    { name: 'Other services', share: 7.2 },
  ],
};

// Open unemployment rate, percent of labour force (August). Source: BPS.
export const UNEMPLOYMENT = {
  unit: 'percent of labour force',
  source: 'BPS (Statistics Indonesia), Sakernas, August round',
  years: [2021, 2022, 2023, 2024],
  values: [6.49, 5.86, 5.32, 4.91],
  extras: [
    { label: 'Labour force', value: '143.1 million people', source: 'BPS, 2024' },
    { label: 'Labour force participation', value: '67.0%', source: 'BPS, 2024' },
    { label: 'Youth unemployment (15–24)', value: '13.1%', source: 'World Bank, 2024' },
  ],
};

// Poverty rate, percent of population (September). Source: BPS.
export const POVERTY = {
  unit: 'percent of population',
  source: 'BPS (Statistics Indonesia), September round',
  years: [2021, 2022, 2023, 2024],
  values: [9.71, 9.57, 9.36, 8.57],
  extras: [
    { label: 'People below the poverty line', value: '24.06 million', source: 'BPS, September 2024' },
    { label: 'Poverty line', value: 'Rp 595,242 per capita per month', source: 'BPS, September 2024' },
    { label: 'Gini ratio', value: '0.349', source: 'World Bank, 2024' },
  ],
};

// Consumer price inflation, percent year on year. Source: BPS.
export const INFLATION = {
  unit: 'percent, year on year',
  source: 'BPS (Statistics Indonesia), consumer price index',
  years: [2021, 2022, 2023, 2024],
  values: [1.87, 5.51, 2.61, 1.57],
  notes: [
    { label: 'What moved prices in 2022', value: 'Fuel-price adjustment in September 2022 lifted CPI to 5.51%.', source: 'BPS' },
    { label: 'What calmed prices in 2024', value: 'Food supply normalised and administered prices were steady, CPI eased to 1.57%.', source: 'BPS' },
  ],
};

// Ten most populous provinces, mid-year 2024, millions. Source: BPS.
export const PROVINCES = {
  unit: 'million people',
  source: 'BPS (Statistics Indonesia), provincial mid-year estimates 2024',
  rows: [
    { name: 'West Java', population: 50.35, capital: 'Bandung' },
    { name: 'East Java', population: 41.81, capital: 'Surabaya' },
    { name: 'Central Java', population: 37.89, capital: 'Semarang' },
    { name: 'North Sumatra', population: 16.09, capital: 'Medan' },
    { name: 'Banten', population: 12.43, capital: 'Serang' },
    { name: 'Jakarta', population: 10.68, capital: 'Jakarta' },
    { name: 'South Sulawesi', population: 9.46, capital: 'Makassar' },
    { name: 'Lampung', population: 9.44, capital: 'Bandar Lampung' },
    { name: 'South Sumatra', population: 9.05, capital: 'Palembang' },
    { name: 'West Sumatra', population: 6.04, capital: 'Padang' },
  ],
};

export const SOURCES = [
  { publisher: 'BPS — Statistics Indonesia', what: 'Population estimates, national accounts, CPI, poverty and Sakernas labour data', where: 'bps.go.id' },
  { publisher: 'World Bank — World Development Indicators', what: 'GDP in current US dollars, GDP per capita, fertility, urban share, life expectancy, youth unemployment', where: 'data.worldbank.org' },
  { publisher: 'Destatis — Statistical Country Profile: Indonesia', what: 'Cross-check of 2024 population, GDP and inflation figures', where: 'destatis.de' },
];
