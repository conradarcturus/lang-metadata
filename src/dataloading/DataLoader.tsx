/**
 * This file provides asynchronous functions to load in data
 */

import { LanguageCode, LanguageData, LocaleData, TerritoryCode, TerritoryData } from '../DataTypes';

import { parseLanguageLine, parseLocaleLine, parseTerritoryLine } from './DataParsing';

export async function loadLanguages(): Promise<Record<LanguageCode, LanguageData> | void> {
  const filename = 'languages200.tsv';

  return await fetch(filename)
    .then((res) => res.text())
    .then((text) => {
      const languages = text.split('\n').slice(1).map(parseLanguageLine);
      return languages.reduce<Record<LanguageCode, LanguageData>>((languagesByCode, lang) => {
        languagesByCode[lang.code] = lang;
        return languagesByCode;
      }, {});
    })
    .catch((err) => console.error('Error loading TSV:', err));
}

export async function loadTerritories(): Promise<Record<TerritoryCode, TerritoryData> | void> {
  return await fetch('territories.tsv')
    .then((res) => res.text())
    .then((text) => {
      const territories = text.split('\n').slice(1).map(parseTerritoryLine);
      return territories.reduce<Record<TerritoryCode, TerritoryData>>(
        (territoriesByCode, territory) => {
          territoriesByCode[territory.code] = territory;
          return territoriesByCode;
        },
        {},
      );
    })
    .catch((err) => console.error('Error loading TSV:', err));
}

export async function loadLocales(): Promise<LocaleData[] | void> {
  const filename = 'locales200.tsv';
  return await fetch(filename)
    .then((res) => res.text())
    .then((text) => {
      return text.split('\n').slice(1).map(parseLocaleLine);
    })
    .catch((err) => console.error('Error loading TSV:', err));
}
