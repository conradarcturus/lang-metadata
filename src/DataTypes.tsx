/**
 * This file provides types for the data used in the application.
 * It includes types for language codes, glottocodes, and language data.
 */

// LanguageCode is ideally an ISO-639 code, or a BCP047 formatted complex language tag
// should be formatted like ab or abc. But there are some languoids with different
// kinds of language codes here as well. This is the main index key for languages and languoids
// TODO Replace generic strings with some form of validation
export type LanguageCode = string;

// Glottocodes come from Glottolog. They should be formatted like abcd1234
export type Glottocode = string;

export type LanguageData = {
  // Provided by the TSV files
  code: LanguageCode;
  glottocode: Glottocode;
  nameDisplay: string;
  nameEndonym: string;
  medium: string;
  script: string;
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
};

// BCP-47 Locale	Locale Display Name	Native Locale Name	Language Code	Territory ISO	Explicit Script	Variant IANA Tag	Pop Source	Best Guess	Official Language
export type BCP47Locale = string; // BCP-47 formatted locale, eg. en_US, fr_CA, etc.
export type ScriptCode = string; // ISO 15924 script code, eg. Latn, Cyrl, etc.
export type VariantIANATag = string; // IANA tag, eg. valencia (for cat-ES-valencia)

export enum OfficialStatus {
  Official = 'official',
  DeFactoOfficial = 'de_facto_official',
  Recognized = 'recognized',
  OfficialRegionally = 'official_regional',
  RecognizedRegionally = 'recognized_regional',
  None = '',
}

export type LocaleData = {
  code: BCP47Locale;
  nameDisplay: string;
  nameEndonym: string;
  languageCode: LanguageCode;
  territoryCode: TerritoryCode;
  explicitScriptCode: ScriptCode;
  variantTag: VariantIANATag;
  populationSource: string;
  populationEstimate: number;
  officialStatus: OfficialStatus;
};
