import React from 'react';

import { getSubstringFilter } from '../../controls/filter';
import { usePageParams } from '../../controls/PageParamsContext';
import { getSortFunction } from '../../controls/sort';
import { useDataContext } from '../../dataloading/DataContext';
import { TerritoryType } from '../../DataTypes';
import ViewCard from '../ViewCard';
import VisibleItemsMeter from '../VisibleItemsMeter';

import TerritoryCard from './TerritoryCard';

const TerritoryCardList: React.FC = () => {
  const { territoriesByCode } = useDataContext();
  const { limit } = usePageParams();
  const sortFunction = getSortFunction();
  const substringFilterFunction = getSubstringFilter();

  // Filter results
  const territoriesFiltered = Object.keys(territoriesByCode)
    .map((territoryCode) => territoriesByCode[territoryCode])
    .filter(
      (territory) =>
        substringFilterFunction(territory) &&
        [TerritoryType.Country, TerritoryType.Dependency].includes(territory.territoryType),
    );
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
          nOverall={Object.keys(territoriesByCode).length}
          nounPlural="territories"
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
