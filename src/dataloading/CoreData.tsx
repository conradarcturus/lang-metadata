import { useState } from 'react';

import {
  BCP47LocaleCode,
  LocaleData,
  ScriptCode,
  TerritoryCode,
  TerritoryData,
  WritingSystemData,
} from '../types/DataTypes';
import { LanguagesBySchema } from '../types/LanguageTypes';

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
  connectWritingSystems,
  groupLanguagesBySchema,
} from './DataAssociations';
import { loadLanguages, loadLocales, loadWritingSystems } from './DataLoader';
import {
  addGlottologLanguages,
  loadGlottologLanguages,
  loadManualGlottocodeToISO,
} from './GlottologData';
import {
  connectTerritoriesToParent,
  createRegionalLocales,
  loadTerritories,
} from './TerritoryData';
import { addCLDRLanguageSchema, loadCLDRAliases } from './UnicodeData';

export type CoreData = {
  languagesBySchema: LanguagesBySchema;
  territories: Record<TerritoryCode, TerritoryData>;
  locales: Record<BCP47LocaleCode, LocaleData>;
  writingSystems: Record<ScriptCode, WritingSystemData>;
};

export const EMPTY_LANGUAGES_BY_SCHEMA: LanguagesBySchema = {
  Inclusive: {},
  ISO: {},
  Glottolog: {},
  UNESCO: {},
  CLDR: {},
};

/**
 * Get core data needed to show the tables -- things like language codes, relationships with other languages.
 */
export function useCoreData(): {
  loadCoreData: () => Promise<void>;
  coreData: CoreData;
} {
  const [languagesBySchema, setLanguagesBySchema] =
    useState<LanguagesBySchema>(EMPTY_LANGUAGES_BY_SCHEMA);
  const [territories, setTerritories] = useState<Record<TerritoryCode, TerritoryData>>({});
  const [locales, setLocales] = useState<Record<BCP47LocaleCode, LocaleData>>({});
  const [writingSystems, setWritingSystems] = useState<Record<ScriptCode, WritingSystemData>>({});

  async function loadCoreData(): Promise<void> {
    const [
      initialLangs,
      isoLangs,
      macroLangs,
      langFamilies,
      isoLangsToFamilies,
      glottologImport,
      manualGlottocodeToISO,
      cldrAliases,
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
      loadCLDRAliases(),
      loadTerritories(),
      loadLocales(),
      loadWritingSystems(),
    ]);
    if (initialLangs == null || territories == null || locales == null || writingSystems == null) {
      alert('Error loading data. Please check the console for more details.');
      return;
    }

    addISODataToLanguages(initialLangs, isoLangs || []);
    const languagesBySchema = groupLanguagesBySchema(initialLangs);
    addISOLanguageFamilyData(languagesBySchema, langFamilies || [], isoLangsToFamilies || {});
    addISOMacrolanguageData(languagesBySchema.ISO, macroLangs || []);
    addGlottologLanguages(languagesBySchema, glottologImport || [], manualGlottocodeToISO || {});
    addCLDRLanguageSchema(languagesBySchema, cldrAliases || []);

    connectLanguagesToParent(languagesBySchema);
    connectTerritoriesToParent(territories);
    connectWritingSystems(languagesBySchema.Inclusive, territories, writingSystems);
    connectLocales(languagesBySchema.Inclusive, territories, writingSystems, locales);
    createRegionalLocales(territories, locales); // create them after connecting them
    computeOtherPopulationStatistics(languagesBySchema, writingSystems);

    setLanguagesBySchema(languagesBySchema);
    setTerritories(territories);
    setLocales(locales);
    setWritingSystems(writingSystems);
  }

  return {
    loadCoreData,
    coreData: {
      languagesBySchema,
      territories,
      locales,
      writingSystems,
    },
  };
}
