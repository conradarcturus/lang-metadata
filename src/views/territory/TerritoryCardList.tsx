import React from 'react';

import { getSubstringFilter, getViableRootEntriesFilter } from '../../controls/filter';
import { usePageParams } from '../../controls/PageParamsContext';
import { getSortFunction } from '../../controls/sort';
import { useDataContext } from '../../dataloading/DataContext';
import ViewCard from '../ViewCard';
import VisibleItemsMeter from '../VisibleItemsMeter';

import TerritoryCard from './TerritoryCard';

const TerritoryCardList: React.FC = () => {
  const { territoriesByCode } = useDataContext();
  const { limit } = usePageParams();
  const sortFunction = getSortFunction();
  const substringFilterFunction = getSubstringFilter();
  const viableEntriesFunction = getViableRootEntriesFilter();

  // Filter to only countries & dependencies
  const territoriesViable = Object.values(territoriesByCode).filter(viableEntriesFunction);
  // Filter results
  const territoriesFiltered = territoriesViable.filter(substringFilterFunction);
  // Sort results & limit how many are visible
  const territoriesVisible = territoriesFiltered
    .sort(sortFunction)
    .slice(0, limit > 0 ? limit : undefined);

  return (
    <div>
      <div className="CardListDescription">
        <VisibleItemsMeter
          nShown={territoriesVisible.length}
          nFiltered={territoriesFiltered.length}
          nOverall={territoriesViable.length}
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
