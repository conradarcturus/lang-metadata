import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { usePageParams } from '../controls/PageParamsContext';
import {
  BCP47LocaleCode,
  LocaleData,
  ScriptCode,
  TerritoryCode,
  TerritoryData,
  WritingSystemData,
} from '../types/DataTypes';
import { LanguageDictionary, LanguagesBySchema, LanguageSchema } from '../types/LanguageTypes';

import { CoreData, EMPTY_LANGUAGES_BY_SCHEMA, useCoreData } from './CoreData';
import { loadSupplementalData } from './SupplementalData';

type DataContextType = {
  languagesBySchema: LanguagesBySchema;
  languages: LanguageDictionary;
  territoriesByCode: Record<TerritoryCode, TerritoryData>;
  locales: Record<BCP47LocaleCode, LocaleData>;
  writingSystems: Record<ScriptCode, WritingSystemData>;
};

const DataContext = createContext<DataContextType | undefined>({
  languagesBySchema: EMPTY_LANGUAGES_BY_SCHEMA,
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
  const { coreData, loadCoreData } = useCoreData();
  const [loadProgress, setLoadProgress] = useState(0);
  const [languages, setLanguages] = useState<LanguageDictionary>({});

  useEffect(() => {
    const loadPrimaryData = async () => {
      await loadCoreData();
      setLoadProgress(1);
    };
    loadPrimaryData();
  }, []); // this is called once after page load

  // After the main load, load additional data
  useMemo(() => {
    if (loadProgress === 1) {
      const loadSecondaryData = async (coreData: CoreData) => {
        await loadSupplementalData(coreData);
        setLoadProgress(2);
      };

      loadSecondaryData(coreData);
    }
  }, [coreData, loadProgress]); // this is called once after page load

  useEffect(() => {
    updateLanguageBasedOnSchema(coreData.languagesBySchema, setLanguages, languageSchema);
  }, [coreData.languagesBySchema, languageSchema]); // when core language data or the language schema changes

  return <DataContext.Provider value={{ ...coreData, languages }}>{children}</DataContext.Provider>;
};

function updateLanguageBasedOnSchema(
  languagesBySchema: LanguagesBySchema,
  setLanguages: Dispatch<SetStateAction<LanguageDictionary>>,
  languageSchema: LanguageSchema,
): void {
  const languages = languagesBySchema[languageSchema];
  // Update language codes
  Object.values(languages).forEach((lang) => {
    const specific = lang.schemaSpecific[languageSchema];
    lang.code = specific.code ?? lang.codeCanonical;
    lang.nameDisplay = specific.name ?? lang.nameCanonical;
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
