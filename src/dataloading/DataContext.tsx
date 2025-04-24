import React, { createContext, useState, useContext, useEffect } from 'react';

import {
  BCP47LocaleCode,
  Glottocode,
  ISO6391LanguageCode,
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
} from './DataAssociations';
import { loadLanguages, loadLocales, loadTerritories, loadWritingSystems } from './DataLoader';
import { addGlottologLanguages, connectGlottolangsToParent, loadLangoids } from './GlottologData';

type DataContextType = {
  languagesByCode: Record<LanguageCode, LanguageData>;

  // Languages by ISO 639-1 or Glottocodes -- so they can be indexed from these schema instead
  languagesByISO6391Code: Record<ISO6391LanguageCode, LanguageData>;
  languagesByGlottocode: Record<Glottocode, LanguageData>;

  territoriesByCode: Record<TerritoryCode, TerritoryData>;
  locales: Record<BCP47LocaleCode, LocaleData>;
  writingSystems: Record<ScriptCode, WritingSystemData>;
};

const DataContext = createContext<DataContextType | undefined>({
  languagesByCode: {},
  languagesByISO6391Code: {},
  languagesByGlottocode: {},
  territoriesByCode: {},
  locales: {},
  writingSystems: {},
});

// Create a provider component
export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [languagesByCode, setLanguagesByCode] = useState<Record<LanguageCode, LanguageData>>({});
  const [languagesByISO6391Code, setLanguagesByISO6391Code] = useState<
    Record<ISO6391LanguageCode, LanguageData>
  >({});
  const [languagesByGlottocode, setLanguagesByGlottocode] = useState<
    Record<Glottocode, LanguageData>
  >({});
  const [territoriesByCode, setTerritoriesByCode] = useState<Record<TerritoryCode, TerritoryData>>(
    {},
  );
  const [locales, setLocales] = useState<Record<BCP47LocaleCode, LocaleData>>({});
  const [writingSystems, setWritingSystems] = useState<Record<ScriptCode, WritingSystemData>>({});

  async function loadData() {
    const [
      langs,
      isoLangs,
      macroLangs,
      langFamilies,
      isoLangsToFamilies,
      glottologImport,
      territories,
      locales,
      writingSystems,
    ] = await Promise.all([
      loadLanguages(),
      loadISOLanguages(),
      loadISOMacrolanguages(),
      loadISOLanguageFamilies(),
      loadISOFamiliesToLanguages(),
      loadLangoids(),
      loadTerritories(),
      loadLocales(),
      loadWritingSystems(),
    ]);
    if (langs == null || territories == null || locales == null || writingSystems == null) {
      alert('Error loading data. Please check the console for more details.');
      return;
    }

    const iso6391Langs = addISODataToLanguages(langs, isoLangs || []);
    addISOLanguageFamilyData(langs, iso6391Langs, langFamilies || [], isoLangsToFamilies || {});
    addISOMacrolanguageData(langs, macroLangs || []);
    const languagesByGlottocode = addGlottologLanguages(langs, glottologImport || []);
    connectLanguagesToParent(langs);
    connectGlottolangsToParent(languagesByGlottocode);
    connectTerritoriesToParent(territories);
    connectWritingSystems(langs, territories, writingSystems);
    connectLocales(langs, territories, writingSystems, locales);
    computeOtherPopulationStatistics(langs, writingSystems);

    setLanguagesByCode(langs);
    setLanguagesByISO6391Code(iso6391Langs);
    setLanguagesByGlottocode(languagesByGlottocode);
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
        languagesByCode,
        languagesByISO6391Code,
        languagesByGlottocode,
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
