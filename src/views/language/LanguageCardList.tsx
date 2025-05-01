import React from 'react';

import { getSubstringFilter } from '../../controls/filter';
import { usePageParams } from '../../controls/PageParamsContext';
import { getSortFunction } from '../../controls/sort';
import { useDataContext } from '../../dataloading/DataContext';
import ViewCard from '../ViewCard';
import VisibleItemsMeter from '../VisibleItemsMeter';

import LanguageCard from './LanguageCard';

const LanguageCardList: React.FC = () => {
  const { languagesByCode } = useDataContext();
  const { limit } = usePageParams();
  const sortByFunction = getSortFunction();
  const substringFilterFunction = getSubstringFilter();

  // Filter results
  const languagesFiltered = Object.values(languagesByCode).filter(substringFilterFunction);
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
          nOverall={Object.keys(languagesByCode).length}
          nounPlural="languages"
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
