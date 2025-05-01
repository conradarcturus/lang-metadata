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
import { separateTitleAndSubtitle } from '../generic/stringUtils';

export function parseLanguageLine(line: string): LanguageData {
  const parts = line.split('\t');
  const nameDisplay = parts[2];
  const [nameDisplayTitle, nameDisplaySubtitle] = separateTitleAndSubtitle(nameDisplay);
  const populationAdjusted =
    parts[9] != '' ? Number.parseInt(parts[9].replace(/,/g, '')) : undefined;
  const populationCited =
    parts[10] != '' ? Number.parseInt(parts[10].replace(/,/g, '')) : undefined;

  return {
    type: Dimension.Language,

    code: parts[0],
    glottocode: parts[1] != '' ? parts[1] : undefined,
    codeISO6391: undefined, // Added by ISO import
    codeISO6392: undefined, // Added by ISO import

    scope: undefined, // Added by ISO import

    nameDisplay,
    nameDisplayTitle,
    nameDisplaySubtitle,
    nameEndonym: parts[3],

    vitalityISO: undefined, // Added by ISO import
    vitalityEth2013: parts[6] != '' ? parts[6] : undefined,
    vitalityEth2025: parts[7] != '' ? parts[7] : undefined,
    digitalSupport: parts[8] != '' ? parts[8] : undefined,
    viabilityConfidence: parts[13] != '' ? parts[13] : 'No',
    viabilityExplanation: parts[14] != '' ? parts[14] : undefined,

    populationAdjusted,
    populationCited,

    medium: parts[4] != '' ? parts[4] : undefined,
    primaryScriptCode: parts[5] != '' ? parts[5] : undefined,
    parentLanguageCode: parts[11] != '' ? parts[11] : undefined,
    parentGlottocode: parts[12] != '' ? parts[12] : undefined,

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
    sample: parts[5] != '' ? parts[5] : null,
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
