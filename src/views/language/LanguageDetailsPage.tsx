import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import ObjectTitle from '../ObjectTitle';

import HoverableLanguageName from './HoverableLanguageName';
import LanguageDetails from './LanguageDetails';

const LanguageDetailsPage: React.FC = () => {
  const { codeFilter } = usePageParams();
  const { languagesBySchema } = useDataContext();
  let lang = languagesBySchema.Inclusive[codeFilter];
  if (lang == null) {
    // It's possible we searched by an alternative code, like "stan" instead of "eng"
    lang ??= languagesBySchema.Glottolog[codeFilter];
    lang ??= languagesBySchema.ISO[codeFilter];
  }

  if (lang == null) {
    return (
      <div className="Details" style={{ textAlign: 'center' }}>
        No language selected. Enter a language code in the search bar. See common languages:
        <div className="separatedButtonList">
          {['eng', 'spa', 'fra', 'deu', 'zho', 'ara'].map(
            (code) =>
              languagesBySchema.ISO[code] != null && (
                <HoverableLanguageName
                  key={code}
                  lang={languagesBySchema.ISO[code]}
                  format="button"
                />
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
