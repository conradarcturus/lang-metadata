import { useMemo } from 'react';

import { useDataContext } from '../../dataloading/DataContext';
import { uniqueBy } from '../../generic/setUtils';
import { Dimension, SearchableField } from '../../types/PageParamTypes';
import { getSearchableField, HighlightedObjectField } from '../../views/common/ObjectField';
import { Suggestion } from '../components/TextInput';
import { getScopeFilter, getSubstringFilterOnQuery } from '../filter';
import { usePageParams } from '../PageParamsContext';

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
  }, [dimension, languages, locales, territories, writingSystems]);

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
          .map((object) => {
            let label = <HighlightedObjectField object={object} field={searchBy} query={query} />;
            console.log(object.ID);
            if (SearchableField.Code === searchBy) {
              label = (
                <>
                  {object.nameDisplay} [{label}]
                </>
              );
            }
            return { id: getSearchableField(object, searchBy), label };
          }),
        (item) => item.id,
      );
    };
  }, [objects, scopeFilter, searchBy]);

  return getSuggestions;
}
