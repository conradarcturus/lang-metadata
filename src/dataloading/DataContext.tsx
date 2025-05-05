import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';

import { usePageParams } from '../controls/PageParamsContext';
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

type DataContextType = {
  languagesBySchema: Record<LanguageSchema, LanguageDict>;
  languages: LanguageDict;
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
  languages: {},
  territoriesByCode: {},
  locales: {},
  writingSystems: {},
});

// Create a provider component
export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { languageSchema } = usePageParams();
  const [languages, setLanguages] = useState<Record<LanguageCode, LanguageData>>({});
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
    updateLanguageBasedOnSchema(languagesBySchema, setLanguages, languageSchema);
    setTerritoriesByCode(territories);
    setLocales(locales);
    setWritingSystems(writingSystems);
  }

  useEffect(() => {
    loadData();
  }, []); // this is called once after page load

  useEffect(() => {
    updateLanguageBasedOnSchema(languagesBySchema, setLanguages, languageSchema);
  }, [languageSchema]); // this is called once after page load

  return (
    <DataContext.Provider
      value={{
        languagesBySchema,
        languages,
        territoriesByCode,
        locales,
        writingSystems,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

function updateLanguageBasedOnSchema(
  languagesBySchema: Record<LanguageSchema, LanguageDict>,
  setLanguages: Dispatch<SetStateAction<LanguageDict>>,
  languageSchema: LanguageSchema,
): void {
  const languages = languagesBySchema[languageSchema];
  // Update language codes
  Object.values(languages).forEach((lang) => {
    const specific = lang.schemaSpecific[languageSchema];
    lang.code = specific.code ?? lang.code;
    lang.scope = specific.scope ?? lang.scope;
    lang.populationOfDescendents = specific.populationOfDescendents ?? undefined;
    lang.parentLanguage = specific.parentLanguage ?? undefined;
    lang.childLanguages = specific.childLanguages ?? [];
  });

  setLanguages(languages);
}

// Custom hook for easier usage
export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useDataContext must be used within a DataProvider');
  return context;
};
