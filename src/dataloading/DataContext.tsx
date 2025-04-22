import React, { createContext, useState, useContext, useEffect } from 'react';

import { LanguageCode, LanguageData, LocaleData, TerritoryCode, TerritoryData } from '../DataTypes';

import {
  connectLanguagesToParent,
  connectLocales,
  connectTerritoriesToParent,
} from './DataAssociations';
import { loadLanguages, loadLocales, loadTerritories } from './DataLoader';

type DataContextType = {
  languagesByCode: Record<LanguageCode, LanguageData>;
  territoriesByCode: Record<TerritoryCode, TerritoryData>;
  locales: LocaleData[];
};

const DataContext = createContext<DataContextType | undefined>({
  languagesByCode: {},
  territoriesByCode: {},
  locales: [],
});

// Create a provider component
export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [languagesByCode, setLanguagesByCode] = useState<Record<LanguageCode, LanguageData>>({});
  const [territoriesByCode, setTerritoriesByCode] = useState<Record<TerritoryCode, TerritoryData>>(
    {},
  );
  const [locales, setLocales] = useState<LocaleData[]>([]);

  async function loadData() {
    const [langs, territories, locales] = await Promise.all([
      loadLanguages(),
      loadTerritories(),
      loadLocales(),
    ]);
    if (langs == null || territories == null || locales == null) {
      return; // Should show an error
    }

    connectLanguagesToParent(langs);
    connectTerritoriesToParent(territories);
    connectLocales(langs, territories, locales);

    setLanguagesByCode(langs);
    setTerritoriesByCode(territories);
    setLocales(locales);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ languagesByCode, territoriesByCode, locales }}>
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
