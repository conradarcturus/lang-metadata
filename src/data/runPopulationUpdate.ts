import fs from 'fs';
import path from 'path';

import { parseTerritoryPopulationTSV, injectPopulationIntoLocales } from './PopulationInjection';
import { computeWritingPopulationForLocales } from './PopulationData-2';
import { parseLanguagesTSV } from './LanguageLoader'; // create this if needed

// Load languages
const langRaw = fs.readFileSync(path.join(__dirname, 'languages.tsv'), 'utf-8');
const locales = parseLanguagesTSV(langRaw); // Your TSV-to-locale loader

// Load territory population data
const popMap = parseTerritoryPopulationTSV(path.join(__dirname, 'territories.tsv'));

// Inject + compute
injectPopulationIntoLocales(locales, popMap);
computeWritingPopulationForLocales(locales);

// Log capped warnings
Object.entries(locales).forEach(([code, loc]) => {
  loc.warnings?.forEach((w) =>
    console.warn(`[${code}] ${w.type}: ${w.message}`)
  );
});

// Optional: write result
fs.writeFileSync('projected-locales.json', JSON.stringify(locales, null, 2));
console.log('✅ Population projection complete!');
