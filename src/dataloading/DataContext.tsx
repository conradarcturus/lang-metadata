import React, { createContext, useState, useContext, useEffect } from 'react';

import { LanguageCode, LanguageData, TerritoryCode, TerritoryData } from '../DataTypes';

import { connectLanguagesToParent, connectTerritoriesToParent } from './DataAssociations';
import { loadLanguages, loadTerritories } from './DataLoader';

type DataContextType = {
  languagesByCode: Record<LanguageCode, LanguageData>;
  territoriesByCode: Record<TerritoryCode, TerritoryData>;
};

const DataContext = createContext<DataContextType | undefined>({
  languagesByCode: {},
  territoriesByCode: {},
});

// Create a provider component
export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [languagesByCode, setLanguagesByCode] = useState<Record<LanguageCode, LanguageData>>({});
  const [territoriesByCode, setTerritoriesByCode] = useState<Record<TerritoryCode, TerritoryData>>(
    {},
  );

  async function loadData() {
    const [langs, territories] = await Promise.all([loadLanguages(), loadTerritories()]);
    if (langs == null || territories == null) {
      return; // Should show an error
    }

    connectLanguagesToParent(langs);
    connectTerritoriesToParent(territories);

    setLanguagesByCode(langs);
    setTerritoriesByCode(territories);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ languagesByCode, territoriesByCode }}>
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
