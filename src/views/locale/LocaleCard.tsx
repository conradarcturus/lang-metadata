import React from 'react';

import { LocaleData } from '../../DataTypes';

import { getOfficialLabel, getPopulationCitation } from './LocaleStrings';

interface Props {
  locale: LocaleData;
}
const LocaleCard: React.FC<Props> = ({ locale }) => {
  const { code, nameDisplay, populationEstimate, officialStatus } = locale;

  return (
    <div>
      <h3>
        <strong>{nameDisplay}</strong> [{code}]
      </h3>
      <div>
        <h4>Speakers</h4>
        {populationEstimate.toLocaleString()}
        {' ['}
        {getPopulationCitation(locale)}
        {']'}
      </div>
      <div>
        <h4>Government status</h4>
        {getOfficialLabel(officialStatus)}
      </div>
    </div>
  );
};

export default LocaleCard;
