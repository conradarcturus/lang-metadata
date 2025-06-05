import React from 'react';

import { useDataContext } from '../../data/DataContext';
import CardList from '../common/CardList';

import LanguageCard from './LanguageCard';

const LanguageCardList: React.FC = () => {
  const { languages } = useDataContext();

  return (
    <CardList
      objects={Object.values(languages)}
      renderCard={(lang) => <LanguageCard lang={lang} includeRelations={true} />}
    />
  );
};

export default LanguageCardList;
