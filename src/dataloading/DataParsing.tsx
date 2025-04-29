import { Dimension } from '../controls/PageParamTypes';
import {
  LanguageData,
  LocaleData,
  OfficialStatus,
  PopulationSourceCategory,
  TerritoryData,
  TerritoryType,
  WritingSystemData,
} from '../DataTypes';
import { separateTitleAndSubtitle } from '../utils/stringUtils';

export function parseLanguageLine(line: string): LanguageData {
  const parts = line.split('\t');
  const nameDisplay = parts[2];
  const [nameDisplayTitle, nameDisplaySubtitle] = separateTitleAndSubtitle(nameDisplay);

  return {
    type: Dimension.Language,

    code: parts[0],
    glottocode: parts[1],
    nameDisplay,
    nameDisplayTitle,
    nameDisplaySubtitle,
    nameEndonym: parts[3],
    medium: parts[4],
    primaryScriptCode: parts[5],
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
    primaryWritingSystem: undefined,
    writingSystems: {},
  };
}

export function parseTerritoryLine(line: string): TerritoryData {
  const parts = line.split('\t');
  return {
    type: Dimension.Territory,

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
    type: Dimension.Locale,

    code: parts[0],
    nameDisplay: parts[1],
    nameEndonym: parts[2],
    languageCode: parts[3],
    territoryCode: parts[4],
    explicitScriptCode: parts[5] != '' ? parts[5] : null,
    variantTag: parts[6] != '' ? parts[6] : null,
    populationSource: parts[7] as PopulationSourceCategory,
    populationEstimate: Number.parseInt(parts[8]?.replace(/,/g, '')),
    officialStatus: parts[9] as OfficialStatus,
  };
}

export function parseWritingSystem(line: string): WritingSystemData {
  const parts = line.split('\t');
  return {
    type: Dimension.WritingSystem,

    code: parts[0],
    nameDisplay: parts[1],
    nameDisplayOriginal: parts[1],
    nameFull: parts[2],
    nameEndonym: parts[3],
    unicodeVersion: parts[4] != '' ? parseFloat(parts[4]) : null,
    sample: parts[5] != '' ? parts[4] : null,
    rightToLeft: parts[6] === 'Yes' ? true : parts[6] === 'no' ? false : null,
    primaryLanguageCode: parts[7] != '' ? parts[7] : null,
    territoryOfOriginCode: parts[8] != '' ? parts[8] : null,
    parentWritingSystemCode: parts[9] != '' ? parts[9] : null,
    containsWritingSystemsCodes: parts[10] != '' ? parts[10].split(', ') : [],

    // Derived when combining other data
    populationUpperBound: 0,
    populationOfDescendents: 0,

    // References to other objects, filled in with DataAssociations methods
    languages: {},
    localesWhereExplicit: [],
    primaryLanguage: undefined,
    territoryOfOrigin: undefined,
    parentWritingSystem: undefined,
    childWritingSystems: [],
    containsWritingSystems: [],
  };
}
