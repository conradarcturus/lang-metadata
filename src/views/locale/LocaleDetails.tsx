import React from 'react';

import { LocaleData } from '../../types/DataTypes';
import HoverableLanguageName from '../language/HoverableLanguageName';
import HoverableTerritoryName from '../territory/HoverableTerritoryName';
import HoverableWritingSystemName from '../writingsystem/HoverableWritingSystemName';

import { getOfficialLabel, getPopulationCitation } from './LocaleStrings';

type Props = {
  locale: LocaleData;
};

const LocaleDetails: React.FC<Props> = ({ locale }) => {
  const {
    explicitScriptCode,
    language,
    languageCode,
    officialStatus,
    populationEstimate,
    populationPercentOfTerritory,
    territory,
    territoryCode,
    variantTag,
    writingSystem,
  } = locale;

  return (
    <div className="Details">
      <div>
        <h3>Definition</h3>
        <div>
          <label>Language:</label>
          {language ? (
            <HoverableLanguageName lang={language} />
          ) : (
            <span>
              {languageCode} <em>[language not in database]</em>
            </span>
          )}
        </div>
        <div>
          <label>Territory:</label>
          {territory ? (
            <HoverableTerritoryName territory={territory} />
          ) : (
            <span>
              {territoryCode} <em>[territory not in database]</em>
            </span>
          )}
        </div>

        {explicitScriptCode && (
          <div>
            <label>Writing System:</label>
            {writingSystem ? (
              <HoverableWritingSystemName writingSystem={writingSystem} />
            ) : (
              <span>
                {explicitScriptCode} <em>[writing system not in database]</em>
              </span>
            )}
          </div>
        )}

        {variantTag && (
          <div>
            <label>Variant:</label>
            {variantTag} <em>[variant not in database]</em>
          </div>
        )}
      </div>
      <div>
        <h3>Attributes</h3>
        <div>
          <label>Speakers:</label>
          {populationEstimate.toLocaleString()}
          {' ['}
          {getPopulationCitation(locale)}
          {']'}
        </div>

        {populationPercentOfTerritory != null && (
          <div>
            <label>Percent of Country:</label>
            {populationPercentOfTerritory.toFixed(1)}%
          </div>
        )}
        {officialStatus && (
          <div>
            <label>Government status:</label>
            {getOfficialLabel(officialStatus)}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocaleDetails;
