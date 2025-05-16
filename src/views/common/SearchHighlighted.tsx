import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import Highlightable from '../../generic/Highlightable';
import { ObjectData } from '../../types/DataTypes';
import { SearchBy } from '../../types/PageParamTypes';

interface Props {
  object: ObjectData;
  field: SearchBy;
}

const SearchHighlighted: React.FC<Props> = ({ object, field }) => {
  const { searchBy, searchString } = usePageParams();
  const lowercaseSearchString = searchString.toLowerCase();
  switch (field) {
    case SearchBy.Code:
      if (searchBy == SearchBy.Code) {
        return <Highlightable text={object.codeDisplay} searchPattern={searchString} />;
      }
      return object.codeDisplay;
    case SearchBy.EngName:
      if ([SearchBy.EngName, SearchBy.AllNames].includes(searchBy)) {
        return <Highlightable text={object.nameDisplay} searchPattern={searchString} />;
      }
      return object.nameDisplay;
    case SearchBy.Endonym:
      if ([SearchBy.Endonym, SearchBy.AllNames].includes(searchBy) && object.nameEndonym) {
        return <Highlightable text={object.nameEndonym} searchPattern={searchString} />;
      }
      return object.nameEndonym;
    case SearchBy.AllNames:
      if (
        searchBy !== SearchBy.AllNames ||
        object.nameDisplay.toLowerCase().includes(lowercaseSearchString) ||
        object.nameEndonym?.toLowerCase().includes(lowercaseSearchString)
      ) {
        // Don't return a highlightable if the regular names already matched.
        // This allows us to only show this if the other searches failed.
        return undefined;
      }
      // If it doesn't, search in other names and returns the one(s) that match
      return (
        <Highlightable
          text={object.names
            .filter((name) => name.toLowerCase().includes(lowercaseSearchString))
            .join(', ')}
          searchPattern={searchString}
        />
      );
    case SearchBy.Territory:
      // Not used
      return object.nameDisplay;
  }
};

export default SearchHighlighted;
