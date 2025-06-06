import React from 'react';

import { numberToFixedUnlessSmall } from '../../generic/numUtils';
import { LocaleData } from '../../types/DataTypes';
import HoverableObjectName from '../common/HoverableObjectName';

import { getOfficialLabel, getPopulationCitation } from './LocaleStrings';

type Props = {
  locale: LocaleData;
};

const LocaleDetails: React.FC<Props> = ({ locale }) => {
  const { officialStatus } = locale;
  return (
    <div className="Details">
      <LocaleDefinitionSection locale={locale} />
      <LocalePopulationSection locale={locale} />
      {officialStatus && (
        <div className="section">
          <h3>Other</h3>
          <div>
            <label>Government status:</label>
            {getOfficialLabel(officialStatus)}
          </div>
        </div>
      )}
    </div>
  );
};

const LocaleDefinitionSection: React.FC<{ locale: LocaleData }> = ({ locale }) => {
  const {
    explicitScriptCode,
    language,
    languageCode,
    territory,
    territoryCode,
    variantTag,
    writingSystem,
  } = locale;

  return (
    <div className="section">
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
  );
};

const LocalePopulationSection: React.FC<{ locale: LocaleData }> = ({ locale }) => {
  const { populationEstimate, populationPercentOfTerritory, territory, censusRecords } = locale;

  return (
    <div className="section">
      <h3>Population</h3>
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
          {numberToFixedUnlessSmall(populationPercentOfTerritory)}%
        </div>
      )}

      {censusRecords.length > 0 && (
        <div>
          <label>Other Censuses:</label>
          <table style={{ marginLeft: '2em', borderSpacing: '1em 0' }}>
            <thead>
              <tr>
                <th>Population</th>
                <th>Percent</th>
                <th>Census</th>
              </tr>
            </thead>
            <tbody>
              {censusRecords
                .sort((a, b) => b.populationPercent - a.populationPercent)
                .map((censusEstimate) => (
                  <tr key={censusEstimate.census.ID}>
                    <td style={{ textAlign: 'right' }}>
                      {censusEstimate.populationEstimate.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {numberToFixedUnlessSmall(censusEstimate.populationPercent)}%
                    </td>
                    <td>
                      <HoverableObjectName object={censusEstimate.census} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LocaleDetails;
