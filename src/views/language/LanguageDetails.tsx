import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { getSortFunction } from '../../controls/sort';
import { useDataContext } from '../../dataloading/DataContext';
import { LanguageData } from '../../DataTypes';
import CommaSeparated from '../../generic/CommaSeparated';
import HoverableLocaleName from '../locale/HoverableLocaleName';
import ObjectTitle from '../ObjectTitle';
import HoverableWritingSystemName from '../writingsystem/HoverableWritingSystemName';

import HoverableLanguageName from './HoverableLanguageName';

type Props = {
  lang?: LanguageData;
};

const LanguageDetails: React.FC<Props> = ({ lang }) => {
  const { codeFilter } = usePageParams();
  const { languagesByCode } = useDataContext();
  lang ??= languagesByCode[codeFilter];

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

  const {
    childLanguages,
    code,
    glottocode,
    locales,
    medium,
    parentLanguage,
    populationCited,
    primaryWritingSystem,
    viabilityConfidence,
    viabilityExplanation,
    vitalityEth2013,
    vitalityEth2025,
    writingSystems,
  } = lang;

  return (
    <div className="Details">
      <h2>
        <ObjectTitle object={lang} />
      </h2>
      <div>
        <h3>Attributes</h3>
        <div>
          <label>Language Code:</label>
          {code}
        </div>
        <div>
          <label>Glottocode:</label>
          {glottocode}
        </div>
        <div>
          <label>Population:</label>
          {populationCited.toLocaleString()}
        </div>
        <div>
          <label>Modality:</label>
          {medium}
        </div>
      </div>
      <div>
        <h3>Vitality & Viability</h3>
        <div>
          <label>Vitality (2013):</label>
          {vitalityEth2013}
        </div>
        <div>
          <label>Vitality (2025):</label>
          {vitalityEth2025}
        </div>
        <div>
          <label>Viability:</label>
          {viabilityConfidence} ... {viabilityExplanation}
        </div>
      </div>
      <div>
        <h3>Connections</h3>
        {locales.length > 0 && (
          <div>
            <label>Found in:</label>
            <CommaSeparated>
              {Object.values(locales).map((locale) => (
                <HoverableLocaleName key={locale.code} labelSource="territory" locale={locale} />
              ))}
            </CommaSeparated>
          </div>
        )}
        {parentLanguage != null && (
          <div>
            <label>Group:</label>
            <HoverableLanguageName lang={parentLanguage} />
          </div>
        )}
        {childLanguages.length > 0 && (
          <div>
            <label>Includes:</label>
            <CommaSeparated>
              {childLanguages.sort(getSortFunction()).map((childLanguage) => (
                <HoverableLanguageName key={childLanguage.code} lang={childLanguage} />
              ))}
            </CommaSeparated>
          </div>
        )}
        {primaryWritingSystem && (
          <div>
            <label>Primary Writing System:</label>
            <HoverableWritingSystemName writingSystem={primaryWritingSystem} />
          </div>
        )}
        {Object.values(writingSystems).length > 0 && (
          <div>
            <label>Writing Systems:</label>
            <CommaSeparated>
              {Object.values(writingSystems)
                .sort(getSortFunction())
                .map((writingSystem) => (
                  <HoverableWritingSystemName
                    key={writingSystem.code}
                    writingSystem={writingSystem}
                  />
                ))}
            </CommaSeparated>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageDetails;
