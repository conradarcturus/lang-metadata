import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import ObjectTitle from '../ObjectTitle';

import HoverableLocaleName from './HoverableLocaleName';
import LocaleDetails from './LocaleDetails';

const LocaleDetailsPage: React.FC = () => {
  const { codeFilter } = usePageParams();
  const { locales } = useDataContext();
  const locale = locales[codeFilter];

  if (locale == null) {
    return (
      <div className="Details" style={{ textAlign: 'center' }}>
        No locale selected. Enter a locale code in the search bar. See common locales:
        <div className="separatedButtonList">
          {['eng_US', 'spa_MX', 'fra_FR', 'deu_DE', 'zho_Hans_CN', 'ara_EG'].map(
            (code) =>
              locales[code] != null && (
                <HoverableLocaleName key={code} locale={locales[code]} format="button" />
              ),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="DetailsPage">
      <h2>
        <ObjectTitle object={locale} />
      </h2>
      <LocaleDetails locale={locale} />
    </div>
  );
};

export default LocaleDetailsPage;
