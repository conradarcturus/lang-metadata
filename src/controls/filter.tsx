import { anyWordStartsWith } from '../generic/stringUtils';
import { ObjectData, TerritoryData } from '../types/DataTypes';
import { Dimension, SearchableField } from '../types/PageParamTypes';
import { getObjectScopeLevel } from '../types/ScopeLevel';
import { getSearchableField } from '../views/common/ObjectField';

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
  return getSubstringFilterOnQuery(searchString.toLowerCase(), searchBy);
}

export function getSubstringFilterOnQuery(
  query: string,
  searchBy: SearchableField,
): FilterFunctionType {
  const queryLowerCase = query;
  switch (searchBy) {
    case SearchableField.Code:
    case SearchableField.Endonym:
    case SearchableField.EngName:
    case SearchableField.NameOrCode:
      return (a: ObjectData) => anyWordStartsWith(getSearchableField(a, searchBy), queryLowerCase);
    case SearchableField.Territory:
      return (a: ObjectData) => {
        return getTerritoriesRelevantToObject(a)
          .map((t) => getSearchableField(t, searchBy))
          .some((t) => anyWordStartsWith(t, queryLowerCase));
      };
    case SearchableField.AllNames:
      return (a: ObjectData) =>
        a.names
          .map((name) => anyWordStartsWith(name, queryLowerCase))
          .reduce((anyPasses, thisPasses) => anyPasses || thisPasses, false);
  }
}

function getTerritoriesRelevantToObject(object: ObjectData): TerritoryData[] {
  switch (object.type) {
    case Dimension.Territory:
      return [object, object.parentUNRegion, object.sovereign].filter((t) => t != null);
    case Dimension.Locale:
      return [object.territory].filter((t) => t != null);
    case Dimension.Language:
      return object.locales.map((l) => l.territory).filter((t) => t != null);
    case Dimension.WritingSystem:
      return [object.territoryOfOrigin].filter((t) => t != null);
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
