import { useMemo } from 'react';

import { ObjectData } from '../DataTypes';

import { usePageParams } from './PageParamsContext';
import { Dimension } from './PageParamTypes';

export type FilterFunctionType = (a: ObjectData) => boolean;

/**
 * Provide a function that filters out items if they match the code or name substring filters
 */
export function getSubstringFilter(): FilterFunctionType {
  const { nameFilter, codeFilter } = usePageParams();
  const lowercaseNameFilter = nameFilter.toLowerCase();
  const lowercaseCodeFilter = codeFilter.toLowerCase();
  const codeFilterFunction = useMemo(() => {
    if (lowercaseCodeFilter == '') {
      return () => true;
    }
    return (a: ObjectData) => a.code.toLowerCase().includes(lowercaseCodeFilter);
  }, [lowercaseCodeFilter]);

  const substringFilterFunction = useMemo(() => {
    if (lowercaseNameFilter == '') {
      return codeFilterFunction;
    }

    return (a: ObjectData) => {
      switch (a.type) {
        case Dimension.Language:
          return (
            codeFilterFunction(a) && a.nameDisplayTitle.toLowerCase().includes(lowercaseNameFilter)
          );
        case Dimension.Locale:
          return codeFilterFunction(a) && a.nameDisplay.toLowerCase().includes(lowercaseNameFilter);
        case Dimension.Territory:
          return codeFilterFunction(a) && a.nameDisplay.toLowerCase().includes(lowercaseNameFilter);
        case Dimension.WritingSystem:
          return codeFilterFunction(a) && a.nameDisplay.toLowerCase().includes(lowercaseNameFilter);
      }
    };
  }, [codeFilterFunction, lowercaseNameFilter]);
  return substringFilterFunction;
}
