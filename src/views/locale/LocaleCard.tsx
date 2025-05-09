import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import Highlightable from '../../generic/Highlightable';
import { LocaleData } from '../../types/DataTypes';

import { getLocaleName, getOfficialLabel, getPopulationCitation } from './LocaleStrings';

interface Props {
  locale: LocaleData;
}
const LocaleCard: React.FC<Props> = ({ locale }) => {
  const { code, populationEstimate, officialStatus, populationPercentOfTerritory, territory } =
    locale;
  const { updatePageParams } = usePageParams();

  return (
    <div>
      <h3>
        <a onClick={() => updatePageParams({ modalObject: code })}>
          <strong>
            <Highlightable str={getLocaleName(locale)} match="nameFilter" />
          </strong>{' '}
          [<Highlightable str={code} match="codeFilter" />]
        </a>
      </h3>
      <div>
        <h4>Speakers</h4>
        {populationEstimate.toLocaleString()}
        {' ['}
        {getPopulationCitation(locale)}
        {']'}
        {populationPercentOfTerritory != null && (
          <div>
            {populationPercentOfTerritory.toFixed(1)}% of {territory?.territoryType ?? 'territory'}
          </div>
        )}
      </div>
      {officialStatus && (
        <div>
          <h4>Government status</h4>
          {getOfficialLabel(officialStatus)}
        </div>
      )}
    </div>
  );
};

export default LocaleCard;
