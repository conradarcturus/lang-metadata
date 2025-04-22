import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import ViewCard from '../ViewCard';

import LanguageCard from './LanguageCard';

const LanguageCardList: React.FC = () => {
  const { languagesByCode } = useDataContext();
  const { code: codeFilter, nameFilter } = usePageParams();
  const lowercaseNameFilter = nameFilter.toLowerCase();
  const lowercaseCodeFilter = codeFilter.toLowerCase();

  return (
    <div className="CardList">
      {Object.keys(languagesByCode)
        .map((languageCode) => languagesByCode[languageCode])
        .filter(
          (lang) =>
            (codeFilter == '' || lang.code.toLowerCase().includes(lowercaseCodeFilter)) &&
            (nameFilter == '' || lang.nameDisplay.toLowerCase().includes(lowercaseNameFilter)),
        )
        .sort((a, b) => b.populationCited - a.populationCited)
        .map((lang) => (
          <ViewCard key={lang.code}>
            <LanguageCard lang={lang} includeRelations={true} />
          </ViewCard>
        ))}
    </div>
  );
};

export default LanguageCardList;
