import React from 'react';

import { ViewType } from '../../types/PageParamTypes';
import { usePageParams } from '../PageParamsContext';
import SingleSelector from '../SingleSelector';

const ViewSelector: React.FC = () => {
  const { viewType, updatePageParams } = usePageParams();

  return (
    <SingleSelector<ViewType>
      getOptionDescription={(option) => <img src={getImageSrc(option)} width={180} />}
      options={[
        ViewType.CardList,
        ViewType.Details,
        ViewType.Hierarchy,
        ViewType.Table,
        ViewType.Warnings,
      ]}
      onChange={(viewType: ViewType) => updatePageParams({ viewType, objectID: undefined })}
      selected={viewType}
      selectorLabel="View:"
    />
  );
};

function getImageSrc(viewType: ViewType): string {
  switch (viewType) {
    case ViewType.CardList:
      return 'cardlist.png';
    case ViewType.Details:
      return 'details.png';
    case ViewType.Hierarchy:
      return 'hierarchy.png';
    case ViewType.Table:
      return 'table.png';
    case ViewType.Warnings:
      return 'warnings.png';
  }
}

export default ViewSelector;
