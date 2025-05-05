import React from 'react';

import { getSubstringFilter, getViableRootEntriesFilter } from '../../controls/filter';
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
  const substringFilterFunction = getSubstringFilter();
  const viableEntriesFunction = getViableRootEntriesFilter();

  // Find the viable languages
  const languagesViable = Object.values(languages).filter(viableEntriesFunction);
  // Filter results by the substring filter
  const languagesFiltered = substringFilterFunction
    ? languagesViable.filter(substringFilterFunction)
    : languagesViable;
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
          nOverall={languagesViable.length}
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
