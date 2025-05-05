import { useMemo } from 'react';

import { LanguageData, LanguageScope, ObjectData, TerritoryType } from '../DataTypes';

import { usePageParams } from './PageParamsContext';
import { Dimension, ViewType } from './PageParamTypes';

export type FilterFunctionType = (a: ObjectData) => boolean;

/**
 * Provide a function that filters out items if they match the code or name substring filters
 */
export function getSubstringFilter(): FilterFunctionType | undefined {
  const { nameFilter, codeFilter } = usePageParams();
  const lowercaseNameFilter = nameFilter.toLowerCase();
  const lowercaseCodeFilter = codeFilter.toLowerCase();
  const codeFilterFunction = useMemo(() => {
    if (lowercaseCodeFilter == '') {
      return () => true;
    }
    return (a: ObjectData) => a.code.toLowerCase().includes(lowercaseCodeFilter);
  }, [lowercaseCodeFilter]);

  const substringFilterFunction = useMemo(() => {
    if (lowercaseNameFilter == '') {
      return codeFilterFunction;
    }

    return (a: ObjectData) => {
      switch (a.type) {
        case Dimension.Language:
          return (
            codeFilterFunction(a) && a.nameDisplayTitle.toLowerCase().includes(lowercaseNameFilter)
          );
        case Dimension.Locale:
          return codeFilterFunction(a) && a.nameDisplay.toLowerCase().includes(lowercaseNameFilter);
        case Dimension.Territory:
          return codeFilterFunction(a) && a.nameDisplay.toLowerCase().includes(lowercaseNameFilter);
        case Dimension.WritingSystem:
          return codeFilterFunction(a) && a.nameDisplay.toLowerCase().includes(lowercaseNameFilter);
      }
    };
  }, [codeFilterFunction, lowercaseNameFilter]);

  if (nameFilter === '' && codeFilter === '') {
    return undefined;
  }
  return substringFilterFunction;
}

/**
 * Provides a function that provides the viable subset of results for a given view.
 */
export function getViableRootEntriesFilter(): FilterFunctionType {
  const { viewType, languageSchema } = usePageParams();

  const viableLanguageFunction = (a: LanguageData): boolean => {
    switch (viewType) {
      case ViewType.CardList:
        return a.scope != LanguageScope.Family;
      case ViewType.Hierarchy:
        return a.schemaSpecific[languageSchema]?.parentLanguage == null;
      case ViewType.Table:
        return true; // not filtering Table
      case ViewType.Details:
        return true; // not filtering Details
      case ViewType.Warnings:
        return true; // not filtering Warnings
    }
  };

  switch (viewType) {
    case ViewType.CardList:
      return (a: ObjectData) => {
        switch (a.type) {
          case Dimension.Language:
            return viableLanguageFunction(a);
          case Dimension.Locale:
            return a.language != null && viableLanguageFunction(a.language);
          case Dimension.Territory:
            return [TerritoryType.Country, TerritoryType.Dependency].includes(a.territoryType);
          case Dimension.WritingSystem:
            return true; // not filtering WritingSystem
        }
      };
    case ViewType.Hierarchy:
      return (a: ObjectData) => {
        switch (a.type) {
          case Dimension.Language:
            return viableLanguageFunction(a);
          case Dimension.Locale:
            return a.language != null && viableLanguageFunction(a.language);
          case Dimension.Territory:
            return a.parentUNRegion == null;
          case Dimension.WritingSystem:
            return a.parentWritingSystem == null;
        }
      };
  }

  return () => true;
}
