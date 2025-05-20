import React from 'react';

import { useMediaQuery } from '../../generic/useMediaQuery';
import { View } from '../../types/PageParamTypes';
import Selector from '../components/Selector';
import SingleChoiceOptions from '../components/SingleChoiceOptions';
import { usePageParams } from '../PageParamsContext';

const ViewSelector: React.FC = () => {
  const { view, updatePageParams } = usePageParams();
  const isCompact = useMediaQuery('(max-width: 1360px)');

  return (
    <Selector selectorLabel="View:" appearance="tabs">
      <SingleChoiceOptions<View>
        getOptionDescription={(option) => <img src={getImageSrc(option)} width={180} />}
        mode={isCompact ? 'dropdown' : 'flat'}
        options={Object.values(View)}
        onChange={(view: View) => updatePageParams({ view, objectID: undefined })}
        selected={view}
      />
    </Selector>
  );
};

function getImageSrc(view: View): string {
  switch (view) {
    case View.CardList:
      return 'cardlist.png';
    case View.Details:
      return 'details.png';
    case View.Hierarchy:
      return 'hierarchy.png';
    case View.Table:
      return 'table.png';
    case View.Notices:
      return 'warnings.png';
  }
}

export default ViewSelector;
