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
  //   Hierarchy = 'hierarchy',
  //   Table = 'table',
}

export enum DataSubset {
  Top200 = 'Top 200',
  All = 'All',
}

export type PageParams = {
  code: string;
  dataSubset: DataSubset;
  dimension: Dimension;
  nameFilter: string;
  viewType: ViewType;
};

export type PageParamsOptional = {
  code?: string;
  dataSubset?: DataSubset;
  dimension?: Dimension;
  nameFilter?: string;
  viewType?: ViewType;
};
