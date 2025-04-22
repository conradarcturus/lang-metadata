import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import CommaSeparated from '../../generic/CommaSeparated';
import { separateTitleAndSubtitle } from '../../utils/stringUtils';

import HoverableLanguageName from './HoverableLanguageName';

const LanguageDetails: React.FC = () => {
  const { code } = usePageParams();
  const { languagesByCode } = useDataContext();
  const lang = languagesByCode[code];

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
    glottocode,
    medium,
    nameDisplay,
    nameEndonym,
    populationCited,
    script,
    viabilityConfidence,
    viabilityExplanation,
    vitalityEth2013,
    vitalityEth2025,
    parentLanguage,
    childLanguages,
  } = lang;
  const [title, subtitle] = separateTitleAndSubtitle(nameDisplay);

  return (
    <div className="Details">
      <h2>
        <strong>{title}</strong> {title != nameEndonym && nameEndonym}
        {subtitle != null && <div className="subtitle">{subtitle} </div>}
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
        <div>
          <label>Writing System:</label>
          {script}
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
              {childLanguages.map((childLanguage) => (
                <HoverableLanguageName key={childLanguage.code} lang={childLanguage} />
              ))}
            </CommaSeparated>
          </div>
        )}
        {parentLanguage == null && childLanguages.length === 0 && (
          <div>There is currently no data available to show connections with other languages.</div>
        )}
      </div>
    </div>
  );
};

export default LanguageDetails;
