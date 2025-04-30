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
    code,
    glottocode,
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
      {parentLanguage != null && (
        <div>
          <label>Group:</label>
          <HoverableLanguageName lang={parentLanguage} />
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
  );
};

export default LanguageDetails;
