import React, { useMemo } from 'react';

import { getSubstringFilter, getScopeFilter } from '../../controls/filter';
import { usePageParams } from '../../controls/PageParamsContext';
import { getSortFunction } from '../../controls/sort';
import { useDataContext } from '../../dataloading/DataContext';
import ViewCard from '../ViewCard';
import VisibleItemsMeter from '../VisibleItemsMeter';

import LocaleCard from './LocaleCard';

const LocaleCardList: React.FC = () => {
  const { locales } = useDataContext();
  const { limit } = usePageParams();
  const filterBySubstring = getSubstringFilter();
  const filterByScope = getScopeFilter();

  // Filter results
  const localeFiltered = useMemo(
    () =>
      Object.values(locales)
        .filter(filterBySubstring ?? (() => true))
        .filter(filterByScope),
    [filterBySubstring, filterByScope],
  );
  // Sort results & limit how many are visible
  const localesVisible = localeFiltered
    .sort(getSortFunction())
    .slice(0, limit > 0 ? limit : undefined);

  return (
    <div>
      <div className="CardListDescription">
        <VisibleItemsMeter
          nShown={localesVisible.length}
          nFiltered={localeFiltered.length}
          nOverall={Object.values(locales).length}
        />
      </div>
      <div className="CardList">
        {localesVisible.map((locale) => (
          <ViewCard key={locale.code}>
            <LocaleCard locale={locale} />
          </ViewCard>
        ))}
      </div>
    </div>
  );
};

export default LocaleCardList;
