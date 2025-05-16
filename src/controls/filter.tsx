import { ObjectData } from '../types/DataTypes';
import { Dimension, SearchBy } from '../types/PageParamTypes';
import { getObjectScopeLevel } from '../types/ScopeLevel';

import { usePageParams } from './PageParamsContext';

export type FilterFunctionType = (a: ObjectData) => boolean;

/**
 * Provide a function that returns true for items that match filters based on substrings of their code or name.
 */
export function getSubstringFilter(): FilterFunctionType | undefined {
  const { searchBy, searchString } = usePageParams();
  if (searchString == '') {
    return undefined;
  }
  const lowercaseSearchString = searchString.toLowerCase();

  switch (searchBy) {
    case SearchBy.EngName:
      return (a: ObjectData) => a.nameDisplay.toLowerCase().includes(lowercaseSearchString);
    case SearchBy.Code:
      return (a: ObjectData) => a.codeDisplay.toLowerCase().includes(lowercaseSearchString);
    case SearchBy.Territory:
      return (a: ObjectData) => {
        switch (a.type) {
          case Dimension.Territory:
            return (
              a.ID.toLowerCase() === lowercaseSearchString ||
              a.containedUNRegionCode.toLowerCase() === lowercaseSearchString ||
              a.sovereignCode.toLowerCase() === lowercaseSearchString
            );
          case Dimension.Locale:
            return a.territoryCode.toLowerCase() === lowercaseSearchString;
          case Dimension.Language:
            return (
              a.locales?.some((l) => l.territoryCode.toLowerCase() === lowercaseSearchString) ??
              false
            );
          case Dimension.WritingSystem:
            return a.territoryOfOriginCode?.toLowerCase() === lowercaseSearchString;
        }
      };
    case SearchBy.Endonym:
      return (a: ObjectData) =>
        a.nameEndonym?.toLowerCase().includes(lowercaseSearchString) ?? false;
    case SearchBy.AllNames:
      return (a: ObjectData) =>
        a.names
          .map((name) => name.toLowerCase().includes(lowercaseSearchString))
          .reduce((anyPasses, thisPasses) => anyPasses || thisPasses, false);
  }
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
    return scopes.includes(getObjectScopeLevel(object));
  }
  return scopeFilter;
}

export function getSliceFunction<T>(): (arr: T[]) => T[] {
  const { page, limit } = usePageParams();
  return (arr: T[]) =>
    limit < 1 || arr.length < limit ? arr : arr.slice(limit * (page - 1), limit * page);
}
