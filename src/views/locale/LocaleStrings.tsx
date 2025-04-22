import { LocaleData, OfficialStatus, PopulationSourceCategory } from '../../DataTypes';

// TODO Add full Citation information, including URLs, potentially as a hovercard
export function getPopulationCitation(locale: LocaleData): string {
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

export function getOfficialLabel(officialStatus: OfficialStatus): string {
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
