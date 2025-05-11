import React from 'react';

import Hoverable from '../../generic/Hoverable';
import { SortBy, ViewType } from '../../types/PageParamTypes';
import { usePageParams } from '../PageParamsContext';
import SingleSelector from '../SingleSelector';

const SortBySelector: React.FC = () => {
  const { sortBy, updatePageParams, viewType } = usePageParams();
  if (viewType === ViewType.Table) {
    // Supported in the table columns
    return <></>;
  }

  return (
    <Hoverable hoverContent={`Choose the order of items in the view.`}>
      <SingleSelector<SortBy>
        options={Object.values(SortBy)}
        onChange={(sortBy: SortBy) => updatePageParams({ sortBy })}
        selected={sortBy}
        groupLabel="Sort by:"
      />
    </Hoverable>
  );
};

export default SortBySelector;
