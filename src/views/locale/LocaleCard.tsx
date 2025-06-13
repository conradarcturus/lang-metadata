import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { numberToFixedUnlessSmall } from '../../generic/numberUtils';
import { LocaleData } from '../../types/DataTypes';
import ObjectTitle from '../common/ObjectTitle';

import { getOfficialLabel, getPopulationCitation } from './LocaleStrings';

interface Props {
  locale: LocaleData;
}
const LocaleCard: React.FC<Props> = ({ locale }) => {
  const { ID, populationSpeaking, officialStatus, populationSpeakingPercent, territory } = locale;
  const { updatePageParams } = usePageParams();

  return (
    <div>
      <h3>
        <a onClick={() => updatePageParams({ objectID: ID })}>
          <ObjectTitle object={locale} highlightSearchMatches={true} />
        </a>
      </h3>
      <div>
        <h4>Speakers</h4>
        {populationSpeaking.toLocaleString()}
        {' ['}
        {getPopulationCitation(locale)}
        {']'}
        {populationSpeakingPercent != null && (
          <div>
            {numberToFixedUnlessSmall(populationSpeakingPercent)}% of{' '}
            {territory?.territoryType ?? 'territory'}
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
