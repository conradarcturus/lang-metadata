import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import ViewCard from '../ViewCard';

import LocaleCard from './LocaleCard';

const LocaleCardList: React.FC = () => {
  const { locales } = useDataContext();
  const { code: codeFilter, nameFilter } = usePageParams();
  const lowercaseNameFilter = nameFilter.toLowerCase();
  const lowercaseCodeFilter = codeFilter.toLowerCase();

  const localesToShow = Object.values(locales).filter(
    (lang) =>
      (codeFilter == '' || lang.code.toLowerCase().includes(lowercaseCodeFilter)) &&
      (nameFilter == '' || lang.nameDisplay.toLowerCase().includes(lowercaseNameFilter)),
  );
  const numberOfLocalesOverall = Object.keys(locales).length;

  return (
    <div>
      <div className="CardListDescription">
        Showing <strong>{localesToShow.length}</strong>
        {numberOfLocalesOverall > localesToShow.length && (
          <> of {<strong>{numberOfLocalesOverall}</strong>} </>
        )}{' '}
        locales.
      </div>
      <div className="CardList">
        {localesToShow
          .sort((a, b) => b.populationEstimate - a.populationEstimate)
          .map((locale) => (
            <ViewCard key={locale.code}>
              <LocaleCard locale={locale} />
            </ViewCard>
          ))}
      </div>
    </div>
  );
};

export default LocaleCardList;
