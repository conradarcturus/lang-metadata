import { LanguageSchema } from './LanguageTypes';

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

export enum ScopeLevel {
  Groups = 'Groups', // Continents, Language Families
  Individuals = 'Individuals', // Countries, Languages
  Parts = 'Parts', // Dependencies, Dialects
  Other = 'Other', // Control Codes, No declared scope
}

export type PageParams = {
  codeFilter: string;
  dimension: Dimension;
  languageSchema: LanguageSchema;
  limit: number; // < 1 means show all
  modalObject: string | null;
  nameFilter: string;
  scopes: ScopeLevel[];
  sortBy: SortBy;
  viewType: ViewType;
};

export type PageParamsOptional = {
  codeFilter?: string;
  dimension?: Dimension;
  languageSchema?: LanguageSchema;
  limit?: number;
  modalObject?: string;
  nameFilter?: string;
  scopes?: ScopeLevel[];
  sortBy?: SortBy;
  viewType?: ViewType;
};
