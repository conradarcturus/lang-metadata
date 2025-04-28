/**
 * This file provides types for the data used in the application.
 * It includes types for language codes, glottocodes, and language data.
 */

import { Dimension } from './controls/PageParamTypes';

export type DataItem = LanguageData | WritingSystemData | TerritoryData | LocaleData;

// LanguageCode is ideally an ISO-639 code, or a BCP047 formatted complex language tag
// should be formatted like ab or abc. But there are some languoids with different
// kinds of language codes here as well. This is the main index key for languages and languoids
// TODO Replace generic strings with some form of validation
export type LanguageCode = string;

// Glottocodes come from Glottolog. They should be formatted like abcd1234
export type Glottocode = string;

export type LanguageData = {
  type: Dimension.Language;

  // Provided by the TSV files
  code: LanguageCode;
  glottocode: Glottocode;
  nameDisplay: string;
  nameDisplayTitle: string;
  nameDisplaySubtitle: string | null;
  nameEndonym: string;
  medium: string;
  primaryScriptCode: ScriptCode;
  vitalityEth2013: string;
  vitalityEth2025: string;
  digitalSupport: string;
  populationAdjusted: number;
  populationCited: number;
  parentLanguageCode: LanguageCode;
  parentGlottocode: Glottocode;
  viabilityConfidence: string;
  viabilityExplanation: string;

  // References to other objects, filled in after loading the TSV
  parentLanguage?: LanguageData;
  // parentLanguoid?: LanguageData; // Reserved after incorporating Glottolog data
  childLanguages: LanguageData[];
  // childLanguoids: LanguageData[];
  locales: LocaleData[];
  primaryWritingSystem?: WritingSystemData;
  writingSystems: Record<ScriptCode, WritingSystemData>;
};

// ISO 3166 territory code OR UN M49 code
export type TerritoryCode = ISO3166Code | UNM49Code;
export type ISO3166Code = string; // ISO 3166-1 alpha-2 code, eg. US, CA, etc.
export type UNM49Code = string; // UN M49 code, eg. 001, 150, 419, etc.

export enum TerritoryType {
  World = 'World',
  Continent = 'Continent',
  Region = 'Region',
  Subcontinent = 'Subcontinent',
  Country = 'Country',
  Dependency = 'Dependency',
}

export type TerritoryData = {
  type: Dimension.Territory;
  code: TerritoryCode;
  nameDisplay: string;
  territoryType: TerritoryType;
  population: number;
  containedUNRegionCode: UNM49Code;
  sovereignCode: ISO3166Code;
  literacy: number;

  // References to other objects, filled in after loading the TSV
  parentUNRegion?: TerritoryData;
  regionContainsTerritories: TerritoryData[];
  sovereign?: TerritoryData;
  dependentTerritories: TerritoryData[];
  locales: LocaleData[];
};

export type ScriptCode = string; // ISO 15924 script code, eg. Latn, Cyrl, etc.

export type WritingSystemData = {
  type: Dimension.WritingSystem;

  code: ScriptCode;
  nameDisplayOriginal: string;
  nameFull: string;
  nameEndonym: string;
  unicodeVersion: number | null;
  sample: string | null;
  rightToLeft: boolean | null;
  primaryLanguageCode: LanguageCode | null;
  territoryOfOriginCode: TerritoryCode | null;
  parentWritingSystemCode: ScriptCode | null;
  containsWritingSystemsCodes: ScriptCode[];

  // Derived when combining data
  populationUpperBound: number;
  nameDisplay: string;

  // References to other objects, filled in after loading the TSV
  primaryLanguage?: LanguageData;
  territoryOfOrigin?: TerritoryData;
  languages: Record<LanguageCode, LanguageData>;
  localesWhereExplicit: LocaleData[];
  parentWritingSystem?: WritingSystemData;
  childWritingSystems: WritingSystemData[];
  containsWritingSystems: WritingSystemData[];
};

// BCP-47 Locale	Locale Display Name	Native Locale Name	Language Code	Territory ISO	Explicit Script	Variant IANA Tag	Pop Source	Best Guess	Official Language
export type BCP47LocaleCode = string; // BCP-47 formatted locale, eg. en_US, fr_CA, etc.
export type VariantIANATag = string; // IANA tag, eg. valencia (for cat-ES-valencia)

export enum PopulationSourceCategory {
  Census = '1 Census',
  Study = '2 Study',
  Ethnologue = '3 Ethnologue',
  EDL = '4 EDL',
  OtherCitation = '5 Other',
  GeneralizedData = '6 Generalized Data',
  Fallback = '7 Fallback',
  NoSource = '',
}

export enum OfficialStatus {
  Official = 'official',
  DeFactoOfficial = 'de_facto_official',
  Recognized = 'recognized',
  OfficialRegionally = 'official_regional',
  RecognizedRegionally = 'recognized_regional',
  None = '',
}

export type LocaleData = {
  type: Dimension.Locale;

  code: BCP47LocaleCode;
  nameDisplay: string;
  nameEndonym: string;
  languageCode: LanguageCode;
  territoryCode: TerritoryCode;
  explicitScriptCode: ScriptCode | null;
  variantTag: VariantIANATag | null;
  populationSource: PopulationSourceCategory;
  populationEstimate: number;
  officialStatus: OfficialStatus;

  // References to other objects, filled in after loading the TSV
  language?: LanguageData;
  territory?: TerritoryData;
  writingSystem?: WritingSystemData;

  // Data added up some references
  populationPercentOfTerritory?: number;
};
