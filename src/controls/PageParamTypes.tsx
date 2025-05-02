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
  //   Table = 'table',
  Warnings = 'Warnings',
}

export enum LanguageSchema {
  Inclusive = 'Inclusive',
  ISO = 'ISO',
  WAL = 'WAL',
  Glottolog = 'Glottolog',
}

export enum SortBy {
  Population = 'Population',
  Code = 'Code',
  Name = 'Name',
}

export type PageParams = {
  codeFilter: string;
  languageSchema: LanguageSchema;
  dimension: Dimension;
  limit: number; // < 1 means show all
  modalObject: string | null;
  nameFilter: string;
  sortBy: SortBy;
  viewType: ViewType;
};

export type PageParamsOptional = {
  codeFilter?: string;
  languageSchema?: LanguageSchema;
  dimension?: Dimension;
  limit?: number;
  modalObject?: string | null;
  nameFilter?: string;
  sortBy?: SortBy;
  viewType?: ViewType;
};
