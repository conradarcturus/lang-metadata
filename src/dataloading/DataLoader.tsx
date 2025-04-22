/**
 * This file provides asynchronous functions to load in data
 */

import { DataSubset } from '../controls/PageParamTypes';
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

export async function loadLanguages(
  dataSubset: DataSubset,
): Promise<Record<LanguageCode, LanguageData> | void> {
  const filename = dataSubset === DataSubset.Top200 ? 'languages200.tsv' : 'languages.tsv';

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

export async function loadLocales(
  dataSubset: DataSubset,
): Promise<Record<BCP47LocaleCode, LocaleData> | void> {
  const filename = dataSubset === DataSubset.Top200 ? 'locales200.tsv' : 'locales.tsv';

  return await fetch(filename)
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
