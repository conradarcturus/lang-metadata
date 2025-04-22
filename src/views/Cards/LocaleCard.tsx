import React from 'react';

import { LocaleData, OfficialStatus, PopulationSourceCategory } from '../../DataTypes';

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

// TODO Add full Citation information, including URLs, potentially as a hovercard
function getPopulationCitation(locale: LocaleData): string {
  switch (locale.populationSource) {
    case PopulationSourceCategory.Census:
      return locale.territoryCode + ' census'; // TODO add year
    case PopulationSourceCategory.Study:
      return 'Study'; // TODO add author, year
    case PopulationSourceCategory.Ethnologue:
      return 'Ethnologue'; // TODO add year
    case PopulationSourceCategory.EDL:
      return 'Endangered Languages Project'; // TODO add year
    case PopulationSourceCategory.OtherCitation:
      return 'weak source, better citation needed'; // TODO add info about the weak source
    case PopulationSourceCategory.GeneralizedData:
      return 'added up from other cited estimates';
    case PopulationSourceCategory.Fallback:
      return 'upper bound based on language / country populations';
    case PopulationSourceCategory.NoSource:
      return 'no source';
  }
}

function getOfficialLabel(officialStatus: OfficialStatus): string {
  switch (officialStatus) {
    case OfficialStatus.Official:
      return 'Official';
    case OfficialStatus.DeFactoOfficial:
      return 'Official (de facto)';
    case OfficialStatus.Recognized:
      return 'Recognized';
    case OfficialStatus.OfficialRegionally:
      return 'Official in a Region';
    case OfficialStatus.RecognizedRegionally:
      return 'Recognized in a Region';
    default:
      return 'None';
  }
}

export default LocaleCard;
