import { useMemo } from 'react';

import { useDataContext } from '../../dataloading/DataContext';
import { uniqueBy } from '../../generic/setUtils';
import { Dimension, SearchableField } from '../../types/PageParamTypes';
import { getSearchableField, HighlightedObjectField } from '../../views/common/ObjectField';
import { Suggestion } from '../components/TextInput';
import { getScopeFilter, getSubstringFilterOnQuery } from '../filter';
import { usePageParams } from '../PageParamsContext';

const SEARCH_RESULTS_LIMIT = 10; // even though it is filtered again later, this seems to prevent render lag.

export function useSearchSuggestions(): (query: string) => Promise<Suggestion[]> {
  const { searchBy, dimension } = usePageParams();
  const { languages, locales, territories, writingSystems } = useDataContext();
  const scopeFilter = getScopeFilter();

  const objects = useMemo(() => {
    if (searchBy === SearchableField.Territory) {
      return Object.values(territories);
    } else {
      switch (dimension) {
        case Dimension.Language:
          return Object.values(languages);
        case Dimension.Locale:
          return Object.values(locales);
        case Dimension.Territory:
          return Object.values(territories);
        case Dimension.WritingSystem:
          return Object.values(writingSystems);
      }
    }
  }, [dimension, languages, locales, territories, writingSystems, searchBy]);

  const getSuggestions = useMemo(() => {
    return async (query: string) => {
      const substringFilter = getSubstringFilterOnQuery(
        query,
        searchBy === SearchableField.Territory ? SearchableField.NameOrCode : searchBy,
      );
      return uniqueBy(
        (objects || [])
          .filter(scopeFilter)
          .filter(substringFilter)
          .slice(0, SEARCH_RESULTS_LIMIT)
          .map((object) => {
            let label = <HighlightedObjectField object={object} field={searchBy} query={query} />;
            let id = getSearchableField(object, searchBy);
            if (searchBy === SearchableField.Code) {
              label = (
                <>
                  {object.nameDisplay} [{label}]
                </>
              );
            } else if (searchBy === SearchableField.Territory) {
              id = object.nameDisplay;
            }
            return { id, label };
          }),
        (item) => item.id,
      );
    };
  }, [objects, scopeFilter, searchBy]);

  return getSuggestions;
}
