import { ObjectBase, TerritoryCode, TerritoryData } from './DataTypes';
import { ObjectType } from './PageParamTypes';
import { ScopeLevel } from './ScopeLevel';

// Unique identifier for the census or other source of population data
export type CensusID = string; // eg. 'Canada 2021 A', 'US 2013 B'

export interface CensusData extends ObjectBase {
  ID: CensusID;
  type: ObjectType.Census;

  // Metadata fields
  citation: string;
  tableName: string;
  columnName: string;
  datePublished: Date;
  dateCollected: Date;
  url: string;
  isoRegionCode: TerritoryCode;
  geographicScope: string; // eg. Whole Country, Mainland, Territories
  age: string; // eg. 0+, 4+,
  gender: string; // Any, Male, Female
  modality: string; // eg. Spoken, Written, Sign
  proficiency: string; // eg. Conversant or Learning, Fluent, Non-Fluent
  acquisitionOrder: string; // eg. Any, L1, L2, L3
  domain: string; // eg. Any, Home, School, Work, Community, Unspecified
  sampleRate: number; // eg. .1, .25, 1 (for 10%, 25%, 100%)
  responsesPerIndividual: number; // eg. 1, 2, 3
  denominator: number; // The total number of qualified individuals in the sample group

  // Some fields derived as the data is imported
  nameDisplay: string;
  codeDisplay: CensusID; // The ID is the code for the collection
  languageCount: number; // Number of languages in this collection

  // Connections to other objects loaded after the fact
  territory?: TerritoryData;

  // Not sure if we can use the scope field
  scope: ScopeLevel.Groups;
}
