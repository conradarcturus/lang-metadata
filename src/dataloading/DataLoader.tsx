/**
 * This file provides asynchronous functions to load in data
 */

import {
  BCP47LocaleCode,
  LanguageCode,
  LanguageData,
  LocaleData,
  ScriptCode,
  TerritoryCode,
  TerritoryData,
  WritingSystemData,
} from '../DataTypes';

import {
  parseLanguageLine,
  parseLocaleLine,
  parseTerritoryLine,
  parseWritingSystem,
} from './DataParsing';

export async function loadLanguages(): Promise<Record<LanguageCode, LanguageData> | void> {
  return await fetch('languages.tsv')
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

export async function loadLocales(): Promise<Record<BCP47LocaleCode, LocaleData> | void> {
  return await fetch('locales.tsv')
    .then((res) => res.text())
    .then((text) => {
      return text
        .split('\n')
        .slice(1)
        .map(parseLocaleLine)
        .reduce<Record<BCP47LocaleCode, LocaleData>>((localesByCode, locale) => {
          localesByCode[locale.code] = locale;
          return localesByCode;
        }, {});
    })
    .catch((err) => console.error('Error loading TSV:', err));
}

export async function loadWritingSystems(): Promise<Record<ScriptCode, WritingSystemData> | void> {
  return await fetch('writingSystems.tsv')
    .then((res) => res.text())
    .then((text) => {
      return text
        .split('\n')
        .slice(1)
        .map(parseWritingSystem)
        .reduce<Record<ScriptCode, WritingSystemData>>((writingsystemsByCode, ws) => {
          writingsystemsByCode[ws.code] = ws;
          return writingsystemsByCode;
        }, {});
    })
    .catch((err) => console.error('Error loading TSV:', err));
}
