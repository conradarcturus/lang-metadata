import React from 'react';

import Hoverable from '../../generic/Hoverable';
import { LocaleSeparator } from '../../types/PageParamTypes';
import { usePageParams } from '../PageParamsContext';
import SingleSelector from '../SingleSelector';

const LocaleSeparatorSelector: React.FC = () => {
  const { localeSeparator, updatePageParams } = usePageParams();

  return (
    <Hoverable hoverContent={`Choose the order of items in the view.`}>
      <SingleSelector<LocaleSeparator>
        options={['_', '-']}
        onChange={(localeSeparator: LocaleSeparator) => updatePageParams({ localeSeparator })}
        selected={localeSeparator}
        groupLabel="Locale Separator:"
      />
    </Hoverable>
  );
};

export default LocaleSeparatorSelector;
