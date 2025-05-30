import { ObjectBase, TerritoryCode, TerritoryData } from './DataTypes';
import { ObjectType } from './PageParamTypes';
import { ScopeLevel } from './ScopeLevel';

// Unique identifier for the census or other source of population data
export type CensusID = string; // eg. 'ca2021.2', 'us2013.1'

export interface CensusData extends ObjectBase {
  ID: CensusID;
  type: ObjectType.Census;

  // Required metadata
  denominator: number; // The total number of qualified individuals in the sample group
  nameDisplay: string;
  isoRegionCode: TerritoryCode;
  yearCollected: number; // eg. 2021, 2013

  // Recommended metadata
  citation?: string;
  tableName?: string;
  columnName?: string;
  datePublished?: Date;
  url?: string;

  geographicScope?: string; // eg. Whole Country, Mainland, Territories
  age?: string; // eg. 0+, 4+,
  gender?: string; // Any, Male, Female
  modality?: string; // eg. Spoken, Written, Sign
  proficiency?: string; // eg. Conversant or Learning, Fluent, Non-Fluent
  acquisitionOrder?: string; // eg. Any, L1, L2, L3
  domain?: string; // eg. Any, Home, School, Work, Community, Unspecified
  sampleRate?: number; // eg. .1, .25, 1 (for 10%, 25%, 100%)
  responsesPerIndividual?: number; // eg. 1, 2, 3

  // Some fields derived as the data is imported
  languageCount: number; // Number of languages in this collection

  // Connections to other objects loaded after the fact
  territory?: TerritoryData;

  // These are not terribly useful, but are required by the ObjectBase interface
  codeDisplay: CensusID;
  scope: ScopeLevel.Individuals;
}
