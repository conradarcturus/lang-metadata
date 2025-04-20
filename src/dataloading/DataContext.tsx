import React, { createContext, useState, useContext, useEffect } from 'react';
import { LanguageCode, LanguageData } from './DataTypes';
import { loadLanguages } from './DataLoader';
import { connectLanguagesToParent } from './DataAssociations';

type DataContextType = {
  languagesByCode: Record<LanguageCode, LanguageData>;
};

const DataContext = createContext<DataContextType | undefined>({
  languagesByCode: {},
});

// Create a provider component
export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [languagesByCode, setLanguagesByCode] = useState<Record<LanguageCode, LanguageData>>({});
  async function loadData() {
    const [langs] = await Promise.all([loadLanguages()]);
    if (langs == null) {
      return; // Should show an error
    }

    connectLanguagesToParent(langs);

    setLanguagesByCode(langs);
  }

  useEffect(() => {
    loadData();
  }, []);

  return <DataContext.Provider value={{ languagesByCode }}>{children}</DataContext.Provider>;
};

// Custom hook for easier usage
export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useDataContext must be used within a DataProvider');
  return context;
};
