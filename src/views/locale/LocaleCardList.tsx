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

  return (
    <div className="CardList">
      {Object.values(locales)
        .filter(
          (lang) =>
            (codeFilter == '' || lang.code.toLowerCase().includes(lowercaseCodeFilter)) &&
            (nameFilter == '' || lang.nameDisplay.toLowerCase().includes(lowercaseNameFilter)),
        )
        .sort((a, b) => b.populationEstimate - a.populationEstimate)
        .map((locale) => (
          <ViewCard key={locale.code}>
            <LocaleCard locale={locale} />
          </ViewCard>
        ))}
    </div>
  );
};

export default LocaleCardList;
