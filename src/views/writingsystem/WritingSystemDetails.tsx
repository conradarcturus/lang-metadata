import React from 'react';

import { getSortFunction } from '../../controls/sort';
import { WritingSystemData } from '../../DataTypes';
import CommaSeparated from '../../generic/CommaSeparated';
import HoverableLanguageName from '../language/HoverableLanguageName';
import HoverableLocaleName from '../locale/HoverableLocaleName';
import HoverableTerritoryName from '../territory/HoverableTerritoryName';

import HoverableWritingSystemName from './HoverableWritingSystemName';

type Props = {
  writingSystem: WritingSystemData;
};

const WritingSystemDetails: React.FC<Props> = ({ writingSystem }) => {
  const {
    childWritingSystems,
    containsWritingSystems,
    languages,
    localesWhereExplicit,
    parentWritingSystem,
    populationUpperBound,
    primaryLanguage,
    primaryLanguageCode,
    rightToLeft,
    sample,
    territoryOfOrigin,
    unicodeVersion,
  } = writingSystem;

  return (
    <div className="Details">
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
