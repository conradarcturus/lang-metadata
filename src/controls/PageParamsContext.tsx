import React, { createContext, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { LanguageSchema } from '../types/LanguageTypes';
import {
  Dimension,
  PageParams,
  PageParamsOptional,
  SortBy,
  ViewType,
} from '../types/PageParamTypes';
import { ScopeLevel } from '../types/ScopeLevel';

type PageParamsContextState = PageParams & {
  updatePageParams: (newParams: PageParamsOptional) => void;
};

const PageParamsContext = createContext<PageParamsContextState | undefined>(undefined);
const DEFAULT_DIMENSION = Dimension.Language;
const DEFAULT_VIEWTYPE = ViewType.CardList;

export const PageParamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pageParams, setPageParams] = useSearchParams({});

  const getParam = (key: string, fallback: string = '') => pageParams.get(key) ?? fallback;

  const updatePageParams = (newParams: PageParamsOptional) => {
    const next = new URLSearchParams(pageParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (['limit', 'page'].includes(key)) {
        // Handle as number
        const valueAsNumber = parseInt(value as string);
        if (isNaN(valueAsNumber) || valueAsNumber < 1) {
          next.set(key, '0');
        } else {
          next.set(key, valueAsNumber.toString());
        }
      } else if (Array.isArray(value)) {
        // Handle as array
        if (value.length === 0) {
          next.delete(key);
        } else {
          next.set(key, value.join(','));
        }
      } else if (value == null || value == '') {
        // Handle as string
        next.delete(key);
      } else {
        next.set(key, value.toString());
      }
    });
    // Clear the some parameters if they match the default
    const defaults = getDefaultParams(
      (next.get('dimension') as Dimension) ?? DEFAULT_DIMENSION,
      (next.get('viewType') as ViewType) ?? DEFAULT_VIEWTYPE,
    );
    if (next.get('limit') == defaults.limit.toString()) {
      next.delete('limit');
    }
    if (next.get('page') == defaults.page.toString()) {
      next.delete('page');
    }
    setPageParams(next);
  };

  const providerValue: PageParamsContextState = useMemo(() => {
    const dimension = getParam('dimension', DEFAULT_DIMENSION) as Dimension;
    const viewType = getParam('viewType', DEFAULT_VIEWTYPE) as ViewType;
    const defaults = getDefaultParams(dimension, viewType);
    return {
      codeFilter: getParam('codeFilter', defaults.codeFilter),
      dimension,
      languageSchema: getParam('languageSchema', defaults.languageSchema) as LanguageSchema,
      limit: parseInt(getParam('limit', defaults.limit.toString())),
      localeSeparator: getParam('localeSeparator', '') === '-' ? '-' : '_',
      modalObject: getParam('modalObject', undefined),
      nameFilter: getParam('nameFilter', defaults.nameFilter),
      page: parseInt(getParam('page', defaults.page.toString())),
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
    localeSeparator: '_',
    modalObject: null,
    nameFilter: '',
    page: 1,
    scopes:
      viewType === ViewType.Hierarchy && dimension !== Dimension.Locale
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
