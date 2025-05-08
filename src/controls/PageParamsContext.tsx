import React, { createContext, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { LanguageSchema } from '../types/LanguageTypes';
import {
  Dimension,
  PageParams,
  PageParamsOptional,
  ScopeLevel,
  SortBy,
  ViewType,
} from '../types/PageParamTypes';

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

  const providerValue: PageParamsContextState = useMemo(() => {
    const dimension = getParam('dimension', Dimension.Language) as Dimension;
    const viewType = getParam('viewType', ViewType.CardList) as ViewType;
    const defaults = getDefaultParams(dimension, viewType);
    return {
      codeFilter: getParam('codeFilter', defaults.codeFilter),
      dimension,
      languageSchema: getParam('languageSchema', defaults.languageSchema) as LanguageSchema,
      limit: parseInt(getParam('limit', defaults.limit.toString())),
      modalObject: getParam('modalObject', undefined),
      nameFilter: getParam('nameFilter', defaults.nameFilter),
      scopes: getParam('scopes', defaults.scopes.join(','))
        .split(',')
        .map((s) => s as ScopeLevel)
        .filter(Boolean),
      sortBy: getParam('sortBy', defaults.sortBy) as SortBy,
      viewType,
      updatePageParams,
    };
  }, [pageParams]);

  return <PageParamsContext.Provider value={providerValue}>{children}</PageParamsContext.Provider>;
};

// If there is nothing in the URL string, then use this instead
function getDefaultParams(dimension: Dimension, viewType: ViewType): PageParams {
  return {
    codeFilter: '',
    dimension,
    languageSchema: LanguageSchema.ISO,
    limit: viewType === ViewType.Table ? 200 : 8,
    modalObject: null,
    nameFilter: '',
    scopes:
      viewType === ViewType.Hierarchy
        ? [ScopeLevel.Groups, ScopeLevel.Individuals]
        : [ScopeLevel.Individuals],
    sortBy: SortBy.Population,
    viewType,
  };
}

export const usePageParams = () => {
  const context = useContext(PageParamsContext);
  if (!context) {
    throw new Error('usePageParams must be used within a PageParamsProvider');
  }
  return context;
};
