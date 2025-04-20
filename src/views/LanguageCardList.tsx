import React from 'react';
import { useDataContext } from '../dataloading/DataContext';
import ViewCard from './Cards/ViewCard';
import LanguageCard from './Cards/LanguageCard';
import './styles.css';
import { usePageParams } from '../controls/PageParamsContext';

const LanguageCardList: React.FC = () => {
  const { languagesByCode } = useDataContext();
  const { code, nameFilter } = usePageParams();
  const lowercaseNameFilter = nameFilter.toLowerCase();

  return (
    <div className="CardList">
      {Object.keys(languagesByCode)
        .map((languageCode) => languagesByCode[languageCode])
        .filter(
          (lang) =>
            (code == '' || lang.code.includes(code)) &&
            (nameFilter == '' || lang.nameDisplay.toLowerCase().includes(lowercaseNameFilter)),
        )
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
