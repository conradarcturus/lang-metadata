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

export type LocaleSeparator = '-' | '_';

export type PageParams = {
  codeFilter: string;
  dimension: Dimension;
  languageSchema: LanguageSchema;
  limit: number; // < 1 means show all
  localeSeparator: LocaleSeparator;
  nameFilter: string;
  objectID: string | null;
  page: number; // 0 indexed
  scopes: ScopeLevel[];
  sortBy: SortBy;
  viewType: ViewType;
};

export type PageParamsOptional = {
  codeFilter?: string;
  dimension?: Dimension;
  languageSchema?: LanguageSchema;
  limit?: number;
  localeSeparator?: string;
  nameFilter?: string;
  objectID?: string;
  page?: number;
  scopes?: ScopeLevel[];
  sortBy?: SortBy;
  viewType?: ViewType;
};
