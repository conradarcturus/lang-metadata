import React, { createContext, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageParams, PageParamsOptional, ViewType } from './PageParamTypes';

type PageParamsContextState = PageParams & {
  updatePageParams: (newParams: PageParamsOptional) => void;
};

const PageParamsContext = createContext<PageParamsContextState | undefined>(undefined);

export const PageParamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pageParams, setPageParams] = useSearchParams({});

  const getParam = (key: string, fallback: string = '') => pageParams.get(key) ?? fallback;

  const updatePageParams = (newParams: PageParamsOptional) => {
    // const next = new URLSearchParams(pageParams);
    // Object.entries(newParams).forEach(([key, value]) => {
    //   if (value === undefined) {
    //     next.delete(key);
    //   } else {
    //     next.set(key, value.toString());
    //   }
    // });
    // setPageParams(next);
    // const next = new URLSearchParams(pageParams);
    setPageParams({ ...pageParams, ...newParams });
  };

  const providerValue: PageParamsContextState = useMemo(
    () => ({
      // filterQuery: getParam("filterQuery"),
      viewType: getParam('viewType', ViewType.CardList) as ViewType,
      updatePageParams,
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
