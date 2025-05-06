import { useMemo } from 'react';

import {
  LanguageData,
  LanguageScope,
  LocaleData,
  ObjectData,
  TerritoryData,
  TerritoryType,
} from '../DataTypes';

import { usePageParams } from './PageParamsContext';
import { Dimension, ScopeLevel } from './PageParamTypes';

export type FilterFunctionType = (a: ObjectData) => boolean;

/**
 * Provide a function that returns true for items that match filters based on substrings of their code or name.
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

    return (a: ObjectData) =>
      codeFilterFunction(a) && a.nameDisplay.toLowerCase().includes(lowercaseNameFilter);
  }, [codeFilterFunction, lowercaseNameFilter]);

  if (nameFilter === '' && codeFilter === '') {
    return undefined;
  }
  return substringFilterFunction;
}

/**
 * Provides a function that filters on the scope of an object
 */
export function getScopeFilter(): FilterFunctionType {
  const { scopes } = usePageParams();

  function scopeFilter(object: ObjectData) {
    if (scopes.length == 0) {
      return true;
    }
    switch (object.type) {
      case Dimension.Language:
        return scopes.includes(getLanguageScopeLevel(object));
      case Dimension.Locale:
        return scopes.includes(getLocaleScopeLevel(object));
      case Dimension.Territory:
        return scopes.includes(getTerritoryScopeLevel(object));
      case Dimension.WritingSystem:
        return true; // Scope not defined yet
    }
  }
  return scopeFilter;
}

function getLanguageScopeLevel(lang: LanguageData): ScopeLevel {
  switch (lang.scope) {
    case LanguageScope.Family:
      return ScopeLevel.Groups;
    case LanguageScope.Macrolanguage:
    case LanguageScope.Language:
      return ScopeLevel.Individuals;
    case LanguageScope.Dialect:
      return ScopeLevel.Parts;
  }
  return ScopeLevel.Other;
}

function getLocaleScopeLevel(locale: LocaleData): ScopeLevel {
  if (locale.variantTag != null) {
    return ScopeLevel.Parts;
  }
  return ScopeLevel.Individuals;
}

function getTerritoryScopeLevel(territory: TerritoryData): ScopeLevel {
  switch (territory.territoryType) {
    case TerritoryType.World:
    case TerritoryType.Continent:
    case TerritoryType.Subcontinent:
    case TerritoryType.Region:
      return ScopeLevel.Groups;
    case TerritoryType.Country:
      return ScopeLevel.Individuals;
    case TerritoryType.Dependency:
      return ScopeLevel.Parts;
  }
}
