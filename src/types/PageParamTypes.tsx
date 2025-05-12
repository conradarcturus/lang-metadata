import { LanguageSchema } from './LanguageTypes';
import { ScopeLevel } from './ScopeLevel';

export enum Dimension {
  Language = 'Language',
  Locale = 'Locale',
  Territory = 'Territory',
  WritingSystem = 'Writing System',
  // VariantTag = 'Variant Tag',
}

export enum ViewType {
  CardList = 'Card List',
  Details = 'Details',
  Hierarchy = 'Hierarchy',
  Table = 'Table',
  Warnings = 'Warnings',
}

export enum SortBy {
  Population = 'Population',
  Code = 'Code',
  Name = 'Name',
}

export enum SearchBy {
  Code = 'Code',
  Name = 'Name',
}

export type LocaleSeparator = '-' | '_';

export type PageParamKey =
  | 'dimension'
  | 'languageSchema'
  | 'limit'
  | 'localeSeparator'
  | 'objectID'
  | 'page'
  | 'scopes'
  | 'searchString'
  | 'searchBy'
  | 'sortBy'
  | 'viewType';

export type PageParams = {
  dimension: Dimension;
  languageSchema: LanguageSchema;
  limit: number; // < 1 means show all
  localeSeparator: LocaleSeparator;
  objectID: string | null;
  page: number; // 0 indexed
  scopes: ScopeLevel[];
  searchBy: SearchBy;
  searchString: string;
  sortBy: SortBy;
  viewType: ViewType;
};

export type PageParamsOptional = {
  dimension?: Dimension;
  languageSchema?: LanguageSchema;
  limit?: number;
  localeSeparator?: string;
  objectID?: string;
  page?: number;
  scopes?: ScopeLevel[];
  searchBy?: SearchBy;
  searchString?: string;
  sortBy?: SortBy;
  viewType?: ViewType;
};
