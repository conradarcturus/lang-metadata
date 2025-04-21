export enum Dimension {
  Language = 'Language',
  // Locale = 'Locale',
  Territory = 'Territory',
  // WritingSystem = 'Writing System',
  // VariantTag = 'Variant Tag',
}

export enum ViewType {
  CardList = 'Card List',
  Details = 'Details',
  //   Hierarchy = 'hierarchy',
  //   Table = 'table',
}

export type PageParams = {
  dimension: Dimension;
  viewType: ViewType;
  code: string;
  nameFilter: string;
};

export type PageParamsOptional = {
  dimension?: Dimension;
  viewType?: ViewType;
  code?: string;
  nameFilter?: string;
};
