/**
 * This file provides types for the data used in the application.
 */

import { LanguageCode, LanguageData } from './LanguageTypes';
import { Dimension } from './PageParamTypes';
import { ScopeLevel } from './ScopeLevel';

export interface ObjectBase {
  type: Dimension;
  code: string;
  nameDisplay: string;
  nameEndonym?: string;
}

export type ObjectData = LanguageData | WritingSystemData | TerritoryData | LocaleData;

// ISO 3166 territory code OR UN M49 code
export type TerritoryCode = ISO3166Code | UNM49Code;
export type ISO3166Code = string; // ISO 3166-1 alpha-2 code, eg. US, CA, etc.
export type UNM49Code = string; // UN M49 code, eg. 001, 150, 419, etc.

export enum TerritoryType {
  World = 'World',
  Continent = 'Continent',
  Region = 'Region',
  Subcontinent = 'Sub-continent',
  Country = 'Country',
  Dependency = 'Dependency',
}

export interface TerritoryData extends ObjectBase {
  type: Dimension.Territory;
  code: TerritoryCode;
  nameDisplay: string;
  territoryType: TerritoryType;
  population: number;
  containedUNRegionCode: UNM49Code;
  sovereignCode: ISO3166Code;

  // Supplemental data
  literacyPercent?: number;
  gdp?: number;

  // References to other objects, filled in after loading the TSV
  parentUNRegion?: TerritoryData;
  containsTerritories: TerritoryData[];
  sovereign?: TerritoryData;
  dependentTerritories: TerritoryData[];
  locales: LocaleData[];
}

export type ScriptCode = string; // ISO 15924 script code, eg. Latn, Cyrl, etc.

export enum WritingSystemScope {
  Group = 'Group',
  IndividualScript = 'Individual script',
  Variation = 'Variation',
  SpecialCode = 'Special Code',
}

export interface WritingSystemData extends ObjectBase {
  type: Dimension.WritingSystem;

  code: ScriptCode;
  scope: WritingSystemScope;
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
  populationOfDescendents: number;

  // References to other objects, filled in after loading the TSV
  primaryLanguage?: LanguageData;
  territoryOfOrigin?: TerritoryData;
  languages: Record<LanguageCode, LanguageData>;
  localesWhereExplicit: LocaleData[];
  parentWritingSystem?: WritingSystemData;
  childWritingSystems: WritingSystemData[];
  containsWritingSystems: WritingSystemData[];
}

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
  Aggregated = 'Aggregated',
}

export enum OfficialStatus {
  Official = 'official',
  DeFactoOfficial = 'de_facto_official',
  Recognized = 'recognized',
  OfficialRegionally = 'official_regional',
  RecognizedRegionally = 'recognized_regional',
}

export interface LocaleData extends ObjectBase {
  type: Dimension.Locale;

  code: BCP47LocaleCode;
  scope: ScopeLevel;

  nameDisplay: string;
  nameEndonym?: string;
  languageCode: LanguageCode;
  territoryCode: TerritoryCode;
  explicitScriptCode?: ScriptCode;
  variantTag?: VariantIANATag;
  populationSource: PopulationSourceCategory;
  populationEstimate: number;
  officialStatus?: OfficialStatus;

  // References to other objects, filled in after loading the TSV
  language?: LanguageData;
  territory?: TerritoryData;
  writingSystem?: WritingSystemData;

  // Data added up some references
  populationPercentOfTerritory?: number;
}
