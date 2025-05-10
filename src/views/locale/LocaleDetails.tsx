import React from 'react';

import { LocaleData } from '../../types/DataTypes';
import HoverableObjectName from '../common/HoverableObjectName';

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
            <HoverableObjectName object={language} />
          ) : (
            <span>
              {languageCode} <em>[language not in database]</em>
            </span>
          )}
        </div>
        <div>
          <label>Territory:</label>
          {territory ? (
            <HoverableObjectName object={territory} />
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
              <HoverableObjectName object={writingSystem} />
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
            <label>Percent of {territory?.territoryType ?? 'territory'}:</label>
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
