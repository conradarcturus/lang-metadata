import React, { useMemo } from 'react';

import { getScopeFilter, getSubstringFilter } from '../../controls/filter';
import { usePageParams } from '../../controls/PageParamsContext';
import { getSortFunction } from '../../controls/sort';
import { useDataContext } from '../../dataloading/DataContext';
import ViewCard from '../ViewCard';
import VisibleItemsMeter from '../VisibleItemsMeter';

import LanguageCard from './LanguageCard';

const LanguageCardList: React.FC = () => {
  const { languages } = useDataContext();
  const { limit } = usePageParams();
  const sortByFunction = getSortFunction();
  const substringFilter = getSubstringFilter();
  const scopeFilter = getScopeFilter();

  // Filter results by the substring and scope filters
  const languagesFiltered = useMemo(
    () =>
      Object.values(languages)
        .filter(substringFilter ?? (() => true))
        .filter(scopeFilter),
    [scopeFilter, substringFilter],
  );
  // Sort results & limit how many are visible
  const languagesVisible = languagesFiltered
    .sort(sortByFunction)
    .slice(0, limit > 0 ? limit : undefined);

  return (
    <div>
      <div className="CardListDescription">
        <VisibleItemsMeter
          nShown={languagesVisible.length}
          nFiltered={languagesFiltered.length}
          nOverall={Object.values(languages).length}
        />
      </div>
      <div className="CardList">
        {languagesVisible.sort(sortByFunction).map((lang) => (
          <ViewCard key={lang.code}>
            <LanguageCard lang={lang} includeRelations={true} />
          </ViewCard>
        ))}
      </div>
    </div>
  );
};

export default LanguageCardList;
