import React, { createContext, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Dimension,
  LanguageSchema,
  PageParams,
  PageParamsOptional,
  ScopeLevel,
  SortBy,
  ViewType,
} from './PageParamTypes';

type PageParamsContextState = PageParams & {
  updatePageParams: (newParams: PageParamsOptional) => void;
};

const PageParamsContext = createContext<PageParamsContextState | undefined>(undefined);

export const PageParamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pageParams, setPageParams] = useSearchParams({});

  const getParam = (key: string, fallback: string = '') => pageParams.get(key) ?? fallback;

  const updatePageParams = (newParams: PageParamsOptional) => {
    const next = new URLSearchParams(pageParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (key === 'limit') {
        const limit = parseInt(value as string);
        if (isNaN(limit) || limit < 1) {
          next.set(key, '-1');
        } else if (limit === 8) {
          next.delete(key);
        } else {
          next.set(key, limit.toString());
        }
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          next.delete(key);
        } else {
          next.set(key, value.join(','));
        }
      } else if (value == null || value == '') {
        next.delete(key);
      } else {
        next.set(key, value.toString());
      }
    });
    setPageParams(next);
  };

  const providerValue: PageParamsContextState = useMemo(
    () => ({
      codeFilter: getParam('codeFilter', ''),
      languageSchema: getParam('languageSchema', LanguageSchema.ISO) as LanguageSchema,
      dimension: getParam('dimension', Dimension.Language) as Dimension,
      limit: parseInt(getParam('limit', '8')),
      nameFilter: getParam('nameFilter', ''),
      scopes: getParam('scopes', ScopeLevel.Individuals)
        .split(',')
        .map((s) => s as ScopeLevel)
        .filter(Boolean),
      sortBy: getParam('sortBy', SortBy.Population) as SortBy,
      viewType: getParam('viewType', ViewType.CardList) as ViewType,
      updatePageParams,
      modalObject: getParam('modalObject', undefined),
    }),
    [pageParams],
  );

  return <PageParamsContext.Provider value={providerValue}>{children}</PageParamsContext.Provider>;
};

export const usePageParams = () => {
  const context = useContext(PageParamsContext);
  if (!context) {
    throw new Error('usePageParams must be used within a PageParamsProvider');
  }
  return context;
};
