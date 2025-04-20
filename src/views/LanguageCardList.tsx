import React from 'react';
import { useDataContext } from '../dataloading/DataContext';
import ViewCard from './Cards/ViewCard';
import LanguageCard from './Cards/LanguageCard';
import './styles.css';

const LanguageCardList: React.FC = () => {
  const { languagesByCode } = useDataContext();

  return (
    <div className="CardList">
      {Object.keys(languagesByCode)
        .map((languageCode) => languagesByCode[languageCode])
        .sort((a, b) => b.populationCited - a.populationCited)
        .map((lang) => (
          <ViewCard key={lang.code}>
            <LanguageCard lang={lang} />
          </ViewCard>
        ))}
    </div>
  );
};

export default LanguageCardList;
