// export enum Dimension {
//   Territory = 'territory',
//   Locale = 'locale',
//   Language = 'language',
//   WritingSystem = 'writing_system',
//   VariantTag = 'variant_tag',
// }

export enum ViewType {
  CardList = 'Card List',
  Details = 'Details',
  //   Hierarchy = 'hierarchy',
  //   Table = 'table',
}

export type PageParams = {
  //   dimension?: Dimension;
  viewType: ViewType;
  code: string;
};

export type PageParamsOptional = {
  //   dimension?: Dimension;
  viewType?: ViewType;
  code?: string;
};
