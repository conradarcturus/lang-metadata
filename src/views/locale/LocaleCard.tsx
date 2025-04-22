import React from 'react';

import { LocaleData } from '../../DataTypes';

import { getLocaleName, getOfficialLabel, getPopulationCitation } from './LocaleStrings';

interface Props {
  locale: LocaleData;
}
const LocaleCard: React.FC<Props> = ({ locale }) => {
  const { code, populationEstimate, officialStatus, populationPercentOfTerritory } = locale;

  return (
    <div>
      <h3>
        <strong>{getLocaleName(locale)}</strong> [{code}]
      </h3>
      <div>
        <h4>Speakers</h4>
        {populationEstimate.toLocaleString()}
        {' ['}
        {getPopulationCitation(locale)}
        {']'}
        {populationPercentOfTerritory != null && (
          <div>{populationPercentOfTerritory.toFixed(1)}% of territory</div>
        )}
      </div>
      <div>
        <h4>Government status</h4>
        {getOfficialLabel(officialStatus)}
      </div>
    </div>
  );
};

export default LocaleCard;
