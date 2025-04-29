import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import ObjectTitle from '../ObjectTitle';

import HoverableLanguageName from './HoverableLanguageName';
import LanguageDetails from './LanguageDetails';

const LanguageDetailsPage: React.FC = () => {
  const { codeFilter } = usePageParams();
  const { languagesByCode } = useDataContext();
  const lang = languagesByCode[codeFilter];

  if (lang == null) {
    const { languagesByCode } = useDataContext();

    return (
      <div className="Details" style={{ textAlign: 'center' }}>
        No language selected. Enter a language code in the search bar. See common languages:
        <div className="separatedButtonList">
          {['eng', 'spa', 'fra', 'deu', 'zho', 'ara'].map(
            (code) =>
              languagesByCode[code] != null && (
                <HoverableLanguageName key={code} lang={languagesByCode[code]} format="button" />
              ),
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="DetailsPage">
      <h2>
        <ObjectTitle object={lang} />
      </h2>
      <LanguageDetails lang={lang} />
    </div>
  );
};

export default LanguageDetailsPage;
