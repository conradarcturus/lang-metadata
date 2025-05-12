import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import Highlightable from '../../generic/Highlightable';
import { LocaleData } from '../../types/DataTypes';
import { SearchBy } from '../../types/PageParamTypes';

import { getOfficialLabel, getPopulationCitation } from './LocaleStrings';

interface Props {
  locale: LocaleData;
}
const LocaleCard: React.FC<Props> = ({ locale }) => {
  const { ID, populationEstimate, officialStatus, populationPercentOfTerritory, territory } =
    locale;
  const { updatePageParams } = usePageParams();

  return (
    <div>
      <h3>
        <a onClick={() => updatePageParams({ objectID: ID })}>
          <strong>
            <Highlightable object={locale} field={SearchBy.Name} />
          </strong>{' '}
          [<Highlightable object={locale} field={SearchBy.Code} />]
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
