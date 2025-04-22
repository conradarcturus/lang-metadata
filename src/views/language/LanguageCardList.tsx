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

  const languagesToShow = Object.values(languagesByCode).filter(
    (lang) =>
      (codeFilter == '' || lang.code.toLowerCase().includes(lowercaseCodeFilter)) &&
      (nameFilter == '' || lang.nameDisplay.toLowerCase().includes(lowercaseNameFilter)),
  );
  const numberOfLanguagesOverall = Object.keys(languagesByCode).length;

  return (
    <div>
      <div className="CardListDescription">
        Showing <strong>{languagesToShow.length}</strong>
        {numberOfLanguagesOverall > languagesToShow.length && (
          <> of {<strong>{numberOfLanguagesOverall}</strong>} </>
        )}{' '}
        languages.
      </div>
      <div className="CardList">
        {languagesToShow
          .sort((a, b) => b.populationCited - a.populationCited)
          .map((lang) => (
            <ViewCard key={lang.code}>
              <LanguageCard lang={lang} includeRelations={true} />
            </ViewCard>
          ))}
      </div>
    </div>
  );
};

export default LanguageCardList;
