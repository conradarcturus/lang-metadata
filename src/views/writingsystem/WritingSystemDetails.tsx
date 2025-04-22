import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';

import HoverableWritingSystem from './HoverableWritingSystem';

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
    nameDisplay,
    nameFull,
    unicodeVersion,
    sample,
    rightToLeft,
    languageOfOriginCode,
    territoryOfOriginCode,
  } = writingSystem;

  return (
    <div className="Details">
      <h2>
        <strong>{nameDisplay}</strong> [{code}]
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
      </div>

      <div>
        <h3>Connections</h3>
        {languageOfOriginCode && (
          <div>
            <label>Language of Origin:</label>
            {languageOfOriginCode}
          </div>
        )}

        {territoryOfOriginCode && (
          <div>
            <label>Territory of Origin:</label>
            {territoryOfOriginCode}
          </div>
        )}
      </div>
    </div>
  );
};
export default WritingSystemDetails;
