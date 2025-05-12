import { ObjectData } from '../types/DataTypes';
import { SearchBy } from '../types/PageParamTypes';
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
    case SearchBy.Name:
      return (a: ObjectData) => a.nameDisplay.toLowerCase().includes(lowercaseSearchString);
    case SearchBy.Code:
      return (a: ObjectData) => a.codeDisplay.toLowerCase().includes(lowercaseSearchString);
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
