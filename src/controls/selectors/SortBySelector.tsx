import React from 'react';

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
    <SingleSelector<SortBy>
      options={Object.values(SortBy)}
      onChange={(sortBy: SortBy) => updatePageParams({ sortBy })}
      selected={sortBy}
      selectorLabel="Sort by:"
      selectorDescription="Choose the order of items in the view."
    />
  );
};

export default SortBySelector;
