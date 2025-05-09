import React from 'react';

import { useDataContext } from '../../dataloading/DataContext';
import CardList from '../common/CardList';

import TerritoryCard from './TerritoryCard';

const TerritoryCardList: React.FC = () => {
  const { territories } = useDataContext();

  return (
    <CardList
      objects={Object.values(territories)}
      renderCard={(territory) => <TerritoryCard territory={territory} />}
    />
  );
};

export default TerritoryCardList;
