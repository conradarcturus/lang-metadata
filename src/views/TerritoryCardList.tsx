import React from 'react';
import ViewCard from './Cards/ViewCard';
import TerritoryCard from './Cards/TerritoryCard';
import { useDataContext } from '../dataloading/DataContext';

const TerritoryCardList: React.FC = () => {
  const { territoriesByCode } = useDataContext();

  return (
    <div className="CardList">
      {Object.keys(territoriesByCode)
        .map((territoryCode) => territoriesByCode[territoryCode])
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
