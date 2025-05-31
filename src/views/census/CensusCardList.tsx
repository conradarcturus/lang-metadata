import React from 'react';

import { useDataContext } from '../../dataloading/DataContext';
import CardList from '../common/CardList';

import CensusCard from './CensusCard';

const CensusCardList: React.FC = () => {
  const { censuses } = useDataContext();

  return (
    <CardList
      objects={Object.values(censuses)}
      renderCard={(census) => <CensusCard census={census} />}
    />
  );
};

export default CensusCardList;
