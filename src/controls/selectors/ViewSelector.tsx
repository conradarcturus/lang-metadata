import React from 'react';

import { useMediaQuery } from '../../generic/useMediaQuery';
import { ViewType } from '../../types/PageParamTypes';
import Selector from '../components/Selector';
import SingleChoiceOptions from '../components/SingleChoiceOptions';
import { usePageParams } from '../PageParamsContext';

const ViewSelector: React.FC = () => {
  const { viewType, updatePageParams } = usePageParams();
  const isCompact = useMediaQuery('(max-width: 1200px)');

  return (
    <Selector selectorLabel="View:" appearance="tabs">
      <SingleChoiceOptions<ViewType>
        getOptionDescription={(option) => <img src={getImageSrc(option)} width={180} />}
        mode={isCompact ? 'dropdown' : 'flat'}
        options={[
          ViewType.CardList,
          ViewType.Details,
          ViewType.Hierarchy,
          ViewType.Table,
          ViewType.Warnings,
        ]}
        onChange={(viewType: ViewType) => updatePageParams({ viewType, objectID: undefined })}
        selected={viewType}
      />
    </Selector>
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
