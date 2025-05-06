import React from 'react';

import { getScopeFilter, getSubstringFilter } from '../../controls/filter';
import { usePageParams } from '../../controls/PageParamsContext';
import { getSortFunction } from '../../controls/sort';
import { useDataContext } from '../../dataloading/DataContext';
import ViewCard from '../ViewCard';
import VisibleItemsMeter from '../VisibleItemsMeter';

import TerritoryCard from './TerritoryCard';

const TerritoryCardList: React.FC = () => {
  const { territoriesByCode } = useDataContext();
  const { limit } = usePageParams();
  const sortBy = getSortFunction();
  const filterBySubstring = getSubstringFilter() || (() => true);
  const filterByScope = getScopeFilter();

  // Filter results
  const territoriesFiltered = Object.values(territoriesByCode)
    .filter(filterByScope)
    .filter(filterBySubstring);
  // Sort results & limit how many are visible
  const territoriesVisible = territoriesFiltered
    .sort(sortBy)
    .slice(0, limit > 0 ? limit : undefined);

  return (
    <div>
      <div className="CardListDescription">
        <VisibleItemsMeter
          nShown={territoriesVisible.length}
          nFiltered={territoriesFiltered.length}
          nOverall={Object.values(territoriesByCode).length}
        />
      </div>
      <div className="CardList">
        {territoriesVisible.map((territory) => (
          <ViewCard key={territory.code}>
            <TerritoryCard territory={territory} />
          </ViewCard>
        ))}
      </div>
    </div>
  );
};

export default TerritoryCardList;
