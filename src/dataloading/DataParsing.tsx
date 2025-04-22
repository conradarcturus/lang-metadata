import {
  LanguageData,
  LocaleData,
  OfficialStatus,
  PopulationSourceCategory,
  TerritoryData,
  TerritoryType,
} from '../DataTypes';

export function parseLanguageLine(line: string): LanguageData {
  const parts = line.split('\t');
  return {
    code: parts[0],
    glottocode: parts[1],
    nameDisplay: parts[2],
    nameEndonym: parts[3],
    medium: parts[4],
    script: parts[5],
    vitalityEth2013: parts[6],
    vitalityEth2025: parts[7],
    digitalSupport: parts[8],
    populationAdjusted: Number.parseInt(parts[9].replace(/,/g, '')),
    populationCited: Number.parseInt(parts[10].replace(/,/g, '')),
    parentLanguageCode: parts[11],
    parentGlottocode: parts[12],
    viabilityConfidence: parts[13],
    viabilityExplanation: parts[14],

    // References to other objects, filled in with DataAssociations methods
    parentLanguage: undefined,
    childLanguages: [],
    locales: [],
  };
}

export function parseTerritoryLine(line: string): TerritoryData {
  const parts = line.split('\t');
  return {
    code: parts[0],
    nameDisplay: parts[1],
    territoryType: parts[2] as TerritoryType,
    population: Number.parseInt(parts[3].replace(/,/g, '')),
    containedUNRegionCode: parts[4],
    sovereignCode: parts[5],
    literacy: Number.parseFloat(parts[6].replace(/,/g, '')),

    // Reference to other objects, filled in with DataAssociations methods
    parentUNRegion: undefined,
    regionContainsTerritories: [],
    sovereign: undefined,
    dependentTerritories: [],
    locales: [],
  };
}

export function parseLocaleLine(line: string): LocaleData {
  const parts = line.split('\t');
  return {
    code: parts[0],
    nameDisplay: parts[1],
    nameEndonym: parts[2],
    languageCode: parts[3],
    territoryCode: parts[4],
    explicitScriptCode: parts[5],
    variantTag: parts[6],
    populationSource: parts[7] as PopulationSourceCategory,
    populationEstimate: Number.parseInt(parts[8]?.replace(/,/g, '')),
    officialStatus: parts[9] as OfficialStatus,
  };
}
