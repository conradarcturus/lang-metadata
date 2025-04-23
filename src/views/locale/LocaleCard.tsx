import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { Dimension, ViewType } from '../../controls/PageParamTypes';
import { LocaleData } from '../../DataTypes';
import Highlightable from '../../generic/Highlightable';

import { getLocaleName, getOfficialLabel, getPopulationCitation } from './LocaleStrings';

interface Props {
  locale: LocaleData;
}
const LocaleCard: React.FC<Props> = ({ locale }) => {
  const { code, populationEstimate, officialStatus, populationPercentOfTerritory } = locale;
  const { updatePageParams } = usePageParams();

  return (
    <div>
      <h3>
        <a
          onClick={() =>
            updatePageParams({ dimension: Dimension.Locale, code, viewType: ViewType.Details })
          }
        >
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
