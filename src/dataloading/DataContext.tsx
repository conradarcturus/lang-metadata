import React, { createContext, useState, useContext, useEffect } from 'react';

import { usePageParams } from '../controls/PageParamsContext';
import {
  BCP47LocaleCode,
  ISO6391LanguageCode,
  LanguageCode,
  LanguageData,
  LocaleData,
  ScriptCode,
  TerritoryCode,
  TerritoryData,
  WritingSystemData,
} from '../DataTypes';

import { addISODataToLanguages, loadISOLanguages } from './AddISOData';
import {
  computeOtherPopulationStatistics,
  connectLanguagesToParent,
  connectLocales,
  connectTerritoriesToParent,
  connectWritingSystems,
} from './DataAssociations';
import { loadLanguages, loadLocales, loadTerritories, loadWritingSystems } from './DataLoader';

type DataContextType = {
  languagesByCode: Record<LanguageCode, LanguageData>;

  // Languages by ISO 639-1 codes -- because some data sources use ISO 639-1 codes to index languages
  languagesByISO6391Code: Record<ISO6391LanguageCode, LanguageData>;

  territoriesByCode: Record<TerritoryCode, TerritoryData>;
  locales: Record<BCP47LocaleCode, LocaleData>;
  writingSystems: Record<ScriptCode, WritingSystemData>;
};

const DataContext = createContext<DataContextType | undefined>({
  languagesByCode: {},
  languagesByISO6391Code: {},
  territoriesByCode: {},
  locales: {},
  writingSystems: {},
});

// Create a provider component
export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { dataSubset } = usePageParams();
  const [languagesByCode, setLanguagesByCode] = useState<Record<LanguageCode, LanguageData>>({});
  const [languagesByISO6391Code, setLanguagesByISO6391Code] = useState<
    Record<ISO6391LanguageCode, LanguageData>
  >({});
  const [territoriesByCode, setTerritoriesByCode] = useState<Record<TerritoryCode, TerritoryData>>(
    {},
  );
  const [locales, setLocales] = useState<Record<BCP47LocaleCode, LocaleData>>({});
  const [writingSystems, setWritingSystems] = useState<Record<ScriptCode, WritingSystemData>>({});

  async function loadData() {
    const [langs, isoLangs, territories, locales, writingSystems] = await Promise.all([
      loadLanguages(dataSubset),
      loadISOLanguages(),
      loadTerritories(),
      loadLocales(dataSubset),
      loadWritingSystems(),
    ]);
    if (langs == null || territories == null || locales == null || writingSystems == null) {
      alert('Error loading data. Please check the console for more details.');
      return;
    }

    const iso6391Langs = addISODataToLanguages(langs, isoLangs || []);
    connectLanguagesToParent(langs);
    connectTerritoriesToParent(territories);
    connectWritingSystems(langs, territories, writingSystems);
    connectLocales(langs, territories, writingSystems, locales);
    computeOtherPopulationStatistics(writingSystems);

    setLanguagesByCode(langs);
    setLanguagesByISO6391Code(iso6391Langs);
    setTerritoriesByCode(territories);
    setLocales(locales);
    setWritingSystems(writingSystems);
  }

  useEffect(() => {
    loadData();
  }, [dataSubset]); // this is called only 1) after page load and 2) when the dataSubset changes

  return (
    <DataContext.Provider
      value={{
        languagesByCode,
        languagesByISO6391Code,
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
