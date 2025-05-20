import { LanguageSchema } from './LanguageTypes';
import { ScopeLevel } from './ScopeLevel';

export enum Dimension {
  Language = 'Language',
  Locale = 'Locale',
  Territory = 'Territory',
  WritingSystem = 'Writing System',
  // VariantTag = 'Variant Tag',
}

export enum View {
  CardList = 'Card List',
  Details = 'Details',
  Hierarchy = 'Hierarchy',
  Table = 'Table',
  Notices = 'Notices',
}

export enum SortBy {
  Population = 'Population',
  Code = 'Code',
  Name = 'Name',
}

export enum SearchableField {
  Code = 'ID',
  NameOrCode = 'English Name or ID',
  EngName = 'English Name',
  Endonym = 'Endonym',
  AllNames = 'All Names',
  Territory = 'Territory',
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
  | 'view';

export type PageParams = {
  dimension: Dimension;
  languageSchema: LanguageSchema;
  limit: number; // < 1 means show all
  localeSeparator: LocaleSeparator;
  objectID?: string;
  page: number; // 0 indexed
  scopes: ScopeLevel[];
  searchBy: SearchableField;
  searchString: string;
  sortBy: SortBy;
  view: View;
};

export type PageParamsOptional = {
  dimension?: Dimension;
  languageSchema?: LanguageSchema;
  limit?: number;
  localeSeparator?: string;
  objectID?: string;
  page?: number;
  scopes?: ScopeLevel[];
  searchBy?: SearchableField;
  searchString?: string;
  sortBy?: SortBy;
  view?: View;
};
