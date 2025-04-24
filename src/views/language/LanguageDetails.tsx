import React from 'react';

import { getSortFunction } from '../../controls/sort';
import { LanguageData } from '../../DataTypes';
import CommaSeparated from '../../generic/CommaSeparated';
import { getLocaleTreeNodes } from '../locale/LocaleTreeList';
import TreeListRoot from '../TreeListRoot';
import HoverableWritingSystemName from '../writingsystem/HoverableWritingSystemName';

import HoverableLanguageName from './HoverableLanguageName';

type Props = {
  lang: LanguageData;
};

const LanguageDetails: React.FC<Props> = ({ lang }) => {
  const sortFunction = getSortFunction();
  const {
    codeISO6391,
    codeISO6392,
    glottocode,
    medium,
    parentGlottolang,
    parentLanguage,
    populationCited,
    primaryWritingSystem,
    vitalityEth2013,
    vitalityEth2025,
    vitalityISO,
    writingSystems,
  } = lang;

  return (
    <div className="Details">
      <div>
        <h3>Identification</h3>
        <div>
          <label>Language Code:</label>
          {lang.code}
        </div>
        <div>
          <label>Glottocode:</label>
          {glottocode ? glottocode : <em>Not in Glottolog</em>}
        </div>
        <div>
          <label>ISO Code:</label>
          {codeISO6392 ? (
            <>
              {codeISO6392}
              {codeISO6391 ? ` | ${codeISO6391}` : ''}
            </>
          ) : (
            <em>Not in ISO catalog</em>
          )}
        </div>
      </div>
      <div>
        <h3>Attributes</h3>
        {populationCited && (
          <div>
            <label>Population:</label>
            {populationCited.toLocaleString()}
          </div>
        )}
        {medium && (
          <div>
            <label>Modality:</label>
            {medium}
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
                .sort(sortFunction)
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
      <div>
        <h3>Vitality & Viability</h3>
        {vitalityISO && (
          <div>
            <label>ISO Vitality / Status:</label>
            {vitalityISO}
          </div>
        )}
        {vitalityEth2013 && (
          <div>
            <label>Ethnologue Vitality (2013):</label>
            {vitalityEth2013}
          </div>
        )}
        {vitalityEth2025 && (
          <div>
            <label>Ethnologue Vitality (2025):</label>
            {vitalityEth2025}
          </div>
        )}
        <div>
          <label>Should use in World Atlas:</label>
          {lang.viabilityConfidence} ... {lang.viabilityExplanation}
        </div>
      </div>
      <div>
        <h3>Connections</h3>
        {parentLanguage && (
          <div>
            <label>ISO group:</label>
            <HoverableLanguageName lang={parentLanguage} />
          </div>
        )}
        {parentGlottolang && (
          <div>
            <label>Glottolog group:</label>
            <HoverableLanguageName lang={parentGlottolang} />
          </div>
        )}
        <div style={{ display: 'flex' }}>
          <div>
            <label>Descendent Languages:</label>
            {lang.childLanguages.length > 0 ? (
              <TreeListRoot rootNodes={[lang]} />
            ) : (
              <div>
                <em>No languages come from this language.</em>
              </div>
            )}
          </div>
          <div>
            <label>Locales:</label>
            {lang.locales.length > 0 ? (
              <TreeListRoot rootNodes={getLocaleTreeNodes([lang], sortFunction)} />
            ) : (
              <div>
                <em>There are no recorded locales for this language.</em>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageDetails;
