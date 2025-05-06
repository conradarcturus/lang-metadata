import React from 'react';

import { getScopeFilter, getSubstringFilter } from '../../controls/filter';
import { usePageParams } from '../../controls/PageParamsContext';
import { getSortFunction } from '../../controls/sort';
import { useDataContext } from '../../dataloading/DataContext';
import ViewCard from '../ViewCard';
import VisibleItemsMeter from '../VisibleItemsMeter';

import WritingSystemCard from './WritingSystemCard';

const WritingSystemCardList: React.FC = () => {
  const { writingSystems } = useDataContext();
  const { limit } = usePageParams();
  const sortFunction = getSortFunction();
  const filterBySubstring = getSubstringFilter();
  const filterByScope = getScopeFilter();

  // Filter results
  const writingSystemsFiltered = Object.values(writingSystems)
    .filter(filterBySubstring ?? (() => true))
    .filter(filterByScope);
  // Sort results & limit how many are visible
  const writingSystemsVisible = writingSystemsFiltered
    .sort(sortFunction)
    .slice(0, limit > 0 ? limit : undefined);

  return (
    <div>
      <div className="CardListDescription">
        <VisibleItemsMeter
          nShown={writingSystemsVisible.length}
          nFiltered={writingSystemsFiltered.length}
          nOverall={Object.keys(writingSystems).length}
        />
      </div>
      <div className="CardList">
        {writingSystemsVisible.map((writingSystem) => (
          <ViewCard key={writingSystem.code}>
            <WritingSystemCard writingSystem={writingSystem} />
          </ViewCard>
        ))}
      </div>
    </div>
  );
};

export default WritingSystemCardList;
