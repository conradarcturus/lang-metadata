import { useState } from 'react';

import { LanguageSchema } from '../controls/PageParamTypes';
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
  addISODataToLanguages,
  addISOLanguageFamilyData,
  addISOMacrolanguageData,
  loadISOFamiliesToLanguages,
  loadISOLanguageFamilies,
  loadISOLanguages,
  loadISOMacrolanguages,
} from './AddISOData';
import {
  computeOtherPopulationStatistics,
  connectLanguagesToParent,
  connectLocales,
  connectTerritoriesToParent,
  connectWritingSystems,
  groupLanguagesBySchema,
} from './DataAssociations';
import { loadLanguages, loadLocales, loadTerritories, loadWritingSystems } from './DataLoader';
import {
  addGlottologLanguages,
  loadGlottologLanguages,
  loadManualGlottocodeToISO,
} from './GlottologData';

type LanguageDict = Record<LanguageCode, LanguageData>;

export type CoreData = {
  languagesBySchema: Record<LanguageSchema, LanguageDict>;
  territoriesByCode: Record<TerritoryCode, TerritoryData>;
  locales: Record<BCP47LocaleCode, LocaleData>;
  writingSystems: Record<ScriptCode, WritingSystemData>;
};

const EMPTY_LANGUAGE_DICTS = { Inclusive: {}, ISO: {}, Glottolog: {}, WAL: {} };

/**
 * Get core data needed to show the tables -- things like language codes, relationships with other languages.
 */
export function useCoreData(): {
  loadCoreData: () => Promise<Record<LanguageSchema, LanguageDict>>;
  coreData: CoreData;
} {
  const [languagesBySchema, setLanguagesBySchema] =
    useState<Record<LanguageSchema, LanguageDict>>(EMPTY_LANGUAGE_DICTS);
  const [territoriesByCode, setTerritoriesByCode] = useState<Record<TerritoryCode, TerritoryData>>(
    {},
  );
  const [locales, setLocales] = useState<Record<BCP47LocaleCode, LocaleData>>({});
  const [writingSystems, setWritingSystems] = useState<Record<ScriptCode, WritingSystemData>>({});

  async function loadCoreData(): Promise<Record<LanguageSchema, LanguageDict>> {
    const [
      initialLangs,
      isoLangs,
      macroLangs,
      langFamilies,
      isoLangsToFamilies,
      glottologImport,
      manualGlottocodeToISO,
      territories,
      locales,
      writingSystems,
    ] = await Promise.all([
      loadLanguages(),
      loadISOLanguages(),
      loadISOMacrolanguages(),
      loadISOLanguageFamilies(),
      loadISOFamiliesToLanguages(),
      loadGlottologLanguages(),
      loadManualGlottocodeToISO(),
      loadTerritories(),
      loadLocales(),
      loadWritingSystems(),
    ]);
    if (initialLangs == null || territories == null || locales == null || writingSystems == null) {
      alert('Error loading data. Please check the console for more details.');
      return EMPTY_LANGUAGE_DICTS;
    }

    const languagesBySchema = groupLanguagesBySchema(initialLangs);
    const iso6391Langs = addISODataToLanguages(languagesBySchema.ISO, isoLangs || []);
    addISOLanguageFamilyData(
      languagesBySchema,
      iso6391Langs,
      langFamilies || [],
      isoLangsToFamilies || {},
    );
    addISOMacrolanguageData(languagesBySchema.ISO, macroLangs || []);
    addGlottologLanguages(languagesBySchema, glottologImport || [], manualGlottocodeToISO || {});
    connectLanguagesToParent(languagesBySchema);
    connectTerritoriesToParent(territories);
    connectWritingSystems(languagesBySchema.Inclusive, territories, writingSystems);
    connectLocales(languagesBySchema.Inclusive, territories, writingSystems, locales);
    computeOtherPopulationStatistics(languagesBySchema, writingSystems);

    setLanguagesBySchema(languagesBySchema);
    setTerritoriesByCode(territories);
    setLocales(locales);
    setWritingSystems(writingSystems);

    return languagesBySchema;
  }

  return {
    loadCoreData,
    coreData: {
      languagesBySchema,
      territoriesByCode,
      locales,
      writingSystems,
    },
  };
}
