import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import { TerritoryType } from '../../DataTypes';
import ViewCard from '../ViewCard';

import TerritoryCard from './TerritoryCard';

const TerritoryCardList: React.FC = () => {
  const { territoriesByCode } = useDataContext();
  const { code: codeFilter, nameFilter } = usePageParams();
  const lowercaseNameFilter = nameFilter.toLowerCase();
  const lowercaseCodeFilter = codeFilter.toLowerCase();

  return (
    <div className="CardList">
      {Object.keys(territoriesByCode)
        .map((territoryCode) => territoriesByCode[territoryCode])
        .filter(
          (territory) =>
            (codeFilter === '' || territory.code.toLowerCase().startsWith(lowercaseCodeFilter)) &&
            (nameFilter === '' ||
              territory.nameDisplay.toLowerCase().includes(lowercaseNameFilter)) &&
            [TerritoryType.Country, TerritoryType.Dependency].includes(territory.territoryType),
        )
        .sort((a, b) => b.population - a.population)
        .map((territory) => (
          <ViewCard key={territory.code}>
            <TerritoryCard territory={territory} />
          </ViewCard>
        ))}
    </div>
  );
};

export default TerritoryCardList;
