import { ObjectData } from '../DataTypes';

import { usePageParams } from './PageParamsContext';
import { Dimension, LanguageSchema, SortBy, ViewType } from './PageParamTypes';

export type SortByFunctionType = (a: ObjectData, b: ObjectData) => number;

export function getSortFunction(languageSchema?: LanguageSchema): SortByFunctionType {
  const { sortBy, viewType, languageSchema: languageSchemaPageParam } = usePageParams();
  const effectiveLanguageSchema = languageSchema ?? languageSchemaPageParam;

  switch (sortBy) {
    case SortBy.Code:
      return (a: ObjectData, b: ObjectData) => {
        if (a.code > b.code) return 1;
        if (b.code > a.code) return -1;
        return 0;
      };
    case SortBy.Name:
      return (a: ObjectData, b: ObjectData) => {
        if (a.nameDisplay > b.nameDisplay) return 1;
        if (b.nameDisplay > a.nameDisplay) return -1;
        return 0;
      };
    case SortBy.Population:
      return (a: ObjectData, b: ObjectData) => {
        switch (a.type) {
          case Dimension.Language:
            return b.type === Dimension.Language
              ? (b.populationCited ?? 0) -
                  (a.populationCited ?? 0) +
                  (viewType === ViewType.Hierarchy
                    ? (b.schemaSpecific[effectiveLanguageSchema].populationOfDescendents ?? 0) -
                      (a.schemaSpecific[effectiveLanguageSchema].populationOfDescendents ?? 0)
                    : 0)
              : -1;
          case Dimension.WritingSystem:
            return b.type === Dimension.WritingSystem
              ? b.populationUpperBound -
                  a.populationUpperBound +
                  (viewType === ViewType.Hierarchy
                    ? b.populationOfDescendents - a.populationOfDescendents
                    : 0)
              : -1;
          case Dimension.Territory:
            return b.type === Dimension.Territory ? b.population - a.population : -1;
          case Dimension.Locale:
            return b.type === Dimension.Locale ? b.populationEstimate - a.populationEstimate : -1;
        }
      };
  }
}
