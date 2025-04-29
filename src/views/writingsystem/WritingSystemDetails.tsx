import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { getSortFunction } from '../../controls/sort';
import { useDataContext } from '../../dataloading/DataContext';
import CommaSeparated from '../../generic/CommaSeparated';
import HoverableLanguageName from '../language/HoverableLanguageName';
import HoverableLocaleName from '../locale/HoverableLocaleName';
import HoverableTerritoryName from '../territory/HoverableTerritoryName';

import HoverableWritingSystem from './HoverableWritingSystem';
import HoverableWritingSystemName from './HoverableWritingSystem';

const WritingSystemDetails: React.FC = () => {
  const { code } = usePageParams();
  const { writingSystems } = useDataContext();
  const writingSystem = writingSystems[code];

  if (writingSystem == null) {
    return (
      <div className="Details" style={{ textAlign: 'center' }}>
        No writing system selected. Enter a writing system code in the search bar. See common
        writing systems:
        <div className="separatedButtonList">
          {['Latn', 'Hans', 'Hant', 'Arab'].map(
            (code) =>
              writingSystems[code] != null && (
                <HoverableWritingSystem
                  key={code}
                  writingSystem={writingSystems[code]}
                  format="button"
                />
              ),
          )}
        </div>
      </div>
    );
  }

  const {
    childWritingSystems,
    containsWritingSystems,
    languages,
    localesWhereExplicit,
    nameDisplay,
    nameEndonym,
    nameFull,
    parentWritingSystem,
    populationUpperBound,
    populationOfDescendents,
    primaryLanguage,
    primaryLanguageCode,
    rightToLeft,
    sample,
    territoryOfOrigin,
    unicodeVersion,
  } = writingSystem;

  return (
    <div className="Details">
      <h2>
        <strong>{nameDisplay}</strong>
        {nameDisplay != nameEndonym && ' ' + nameEndonym} [{code}]
        {nameDisplay != nameFull && <div className="subtitle">{nameFull}</div>}
      </h2>
      <div>
        <h3>Attributes</h3>
        {rightToLeft != null && (
          <div>
            <label>Direction:</label>
            {rightToLeft ? 'Right to Left' : 'Left to Right'}
          </div>
        )}
        {sample && (
          <div>
            <label>Sample:</label>
            {sample}
          </div>
        )}
        <div>
          <label>Unicode Support:</label>
          {unicodeVersion != null ? (
            `since version ${unicodeVersion}`
          ) : (
            <em>Not supported by Unicode</em>
          )}
        </div>
        {populationUpperBound > 100 && ( // Values less than 100 are suspcious and probably spurious
          <div>
            <label>Population (Upper Bound):</label>
            {populationUpperBound.toLocaleString()}
          </div>
        )}
      </div>

      <div>
        <h3>Connections</h3>
        {primaryLanguageCode != null && (
          <div>
            <label>Primary language:</label>
            {primaryLanguage != null ? (
              <HoverableLanguageName lang={primaryLanguage} />
            ) : (
              primaryLanguageCode
            )}
          </div>
        )}
        {Object.values(languages).length > 0 && (
          <div>
            <label>Languages:</label>
            <CommaSeparated>
              {Object.values(languages)
                .sort(getSortFunction())
                .map((lang) => (
                  <HoverableLanguageName key={lang.code} lang={lang} />
                ))}
            </CommaSeparated>
          </div>
        )}

        {territoryOfOrigin && (
          <div>
            <label>Territory of Origin:</label>
            <HoverableTerritoryName territory={territoryOfOrigin} />
          </div>
        )}

        {localesWhereExplicit.length > 0 && (
          <div>
            <label>Locales (where writing system is explicit):</label>
            <CommaSeparated>
              {localesWhereExplicit.sort(getSortFunction()).map((locale) => (
                <HoverableLocaleName key={locale.code} locale={locale} />
              ))}
            </CommaSeparated>
          </div>
        )}

        {parentWritingSystem && (
          <div>
            <label>Originated from:</label>
            <HoverableWritingSystemName writingSystem={parentWritingSystem} />
          </div>
        )}
        {childWritingSystems.length > 0 && (
          <div>
            <label>Inspired:</label>
            <CommaSeparated>
              {childWritingSystems.sort(getSortFunction()).map((writingSystem) => (
                <HoverableWritingSystemName
                  key={writingSystem.code}
                  writingSystem={writingSystem}
                />
              ))}
            </CommaSeparated>
          </div>
        )}
        {containsWritingSystems.length > 0 && (
          <div>
            <label>Contains:</label>
            <CommaSeparated>
              {containsWritingSystems.sort(getSortFunction()).map((writingSystem) => (
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
export default WritingSystemDetails;
