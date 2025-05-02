import { useMemo } from 'react';

import { LanguageData, LanguageScope, ObjectData, TerritoryType } from '../DataTypes';

import { usePageParams } from './PageParamsContext';
import { Dimension, LanguageSchema, ViewType } from './PageParamTypes';

export type FilterFunctionType = (a: ObjectData) => boolean;

/**
 * Provide a function that filters out items if they match the code or name substring filters
 */
export function getSubstringFilter(): FilterFunctionType {
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
  return substringFilterFunction;
}

export function getLanguageSchemaFilter(): (a: LanguageData) => boolean {
  const { languageSchema } = usePageParams();
  switch (languageSchema) {
    case LanguageSchema.Inclusive:
      return () => true;
    case LanguageSchema.ISO:
      return (a: LanguageData) => a.codeISO6392 != null;
    case LanguageSchema.Glottolog:
      return (a: LanguageData) => a.glottocode != null;
    case LanguageSchema.WAL:
      return (a: LanguageData) => a.viabilityConfidence != null && a.viabilityConfidence != 'No';
  }
}

/**
 * Provides a function that provides the viable subset of results for a given view.
 */
export function getViableRootEntriesFilter(): FilterFunctionType {
  const { viewType, languageSchema } = usePageParams();
  const languageSchemaFilterFunction = getLanguageSchemaFilter();

  const viableLanguageFunction = (a: LanguageData): boolean => {
    switch (viewType) {
      case ViewType.CardList:
        return languageSchemaFilterFunction(a) && a.scope != LanguageScope.Family;
      case ViewType.Hierarchy:
        if (languageSchema == LanguageSchema.Glottolog) {
          return (
            languageSchemaFilterFunction(a) &&
            (a.parentGlottolang == null || !languageSchemaFilterFunction(a.parentGlottolang))
          );
        } else if (languageSchema == LanguageSchema.Inclusive) {
          return (
            languageSchemaFilterFunction(a) &&
            (a.parentLanguage == null || !languageSchemaFilterFunction(a.parentLanguage))
          );
        } else {
          return (
            languageSchemaFilterFunction(a) &&
            (a.parentISOlang == null || !languageSchemaFilterFunction(a.parentISOlang))
          );
        }
      case ViewType.Details:
        return true; // not filtering Details
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
