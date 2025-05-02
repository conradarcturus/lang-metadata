import React, { createContext, useState, useContext, useEffect } from 'react';

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

type DataContextType = {
  languagesBySchema: Record<LanguageSchema, Record<LanguageCode, LanguageData>>;
  territoriesByCode: Record<TerritoryCode, TerritoryData>;
  locales: Record<BCP47LocaleCode, LocaleData>;
  writingSystems: Record<ScriptCode, WritingSystemData>;
};

const DataContext = createContext<DataContextType | undefined>({
  languagesBySchema: {
    Inclusive: {},
    ISO: {},
    Glottolog: {},
    WAL: {},
  },
  territoriesByCode: {},
  locales: {},
  writingSystems: {},
});

// Create a provider component
export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [languagesBySchema, setLanguagesBySchema] = useState<
    Record<LanguageSchema, Record<LanguageCode, LanguageData>>
  >({
    Inclusive: {},
    ISO: {},
    Glottolog: {},
    WAL: {},
  });
  const [territoriesByCode, setTerritoriesByCode] = useState<Record<TerritoryCode, TerritoryData>>(
    {},
  );
  const [locales, setLocales] = useState<Record<BCP47LocaleCode, LocaleData>>({});
  const [writingSystems, setWritingSystems] = useState<Record<ScriptCode, WritingSystemData>>({});

  async function loadData() {
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
      return;
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
  }

  useEffect(() => {
    loadData();
  }, []); // this is called once after page load

  return (
    <DataContext.Provider
      value={{
        languagesBySchema,
        territoriesByCode,
        locales,
        writingSystems,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook for easier usage
export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useDataContext must be used within a DataProvider');
  return context;
};
