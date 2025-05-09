import { useMemo } from 'react';

import { ObjectData } from '../types/DataTypes';
import { getObjectScopeLevel } from '../types/ScopeLevel';

import { usePageParams } from './PageParamsContext';

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
    return (a: ObjectData) => a.codeDisplay.toLowerCase().includes(lowercaseCodeFilter);
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
    return scopes.includes(getObjectScopeLevel(object));
  }
  return scopeFilter;
}

export function getSliceFunction<T>(): (arr: T[]) => T[] {
  const { page, limit } = usePageParams();
  return (arr: T[]) =>
    limit < 1 || arr.length < limit ? arr : arr.slice(limit * (page - 1), limit * page);
}
