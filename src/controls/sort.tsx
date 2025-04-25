import { DataItem } from '../DataTypes';

import { usePageParams } from './PageParamsContext';
import { Dimension, SortBy } from './PageParamTypes';

type SortByFunctionType = (a: DataItem, b: DataItem) => number;

export function getSortFunction(): SortByFunctionType {
  const { sortBy } = usePageParams();

  switch (sortBy) {
    case SortBy.Code:
      return (a: DataItem, b: DataItem) => {
        if (a.code > b.code) return 1;
        if (b.code > a.code) return -1;
        return 0;
      };
    case SortBy.Name:
      return (a: DataItem, b: DataItem) => {
        if (a.nameDisplay > b.nameDisplay) return 1;
        if (b.nameDisplay > a.nameDisplay) return -1;
        return 0;
      };
    case SortBy.Population:
      return (a: DataItem, b: DataItem) => {
        switch (a.type) {
          case Dimension.Language:
            return b.type === Dimension.Language ? b.populationCited - a.populationCited : -1;
          case Dimension.WritingSystem:
            return b.type === Dimension.WritingSystem
              ? b.populationUpperBound - a.populationUpperBound
              : -1;
          case Dimension.Territory:
            return b.type === Dimension.Territory ? b.population - a.population : -1;
          case Dimension.Locale:
            return b.type === Dimension.Locale ? b.populationEstimate - a.populationEstimate : -1;
        }
      };
  }
}
