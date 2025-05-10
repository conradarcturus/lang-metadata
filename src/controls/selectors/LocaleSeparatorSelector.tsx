import React from 'react';

import Hoverable from '../../generic/Hoverable';
import { LocaleSeparator } from '../../types/PageParamTypes';
import ButtonGroupSingleChoice from '../ButtonGroupSingleChoice';
import { usePageParams } from '../PageParamsContext';

const LocaleSeparatorSelector: React.FC = () => {
  const { localeSeparator, updatePageParams } = usePageParams();

  return (
    <Hoverable hoverContent={`Choose the order of items in the view.`}>
      <ButtonGroupSingleChoice<LocaleSeparator>
        options={['_', '-']}
        onChange={(localeSeparator: LocaleSeparator) => updatePageParams({ localeSeparator })}
        selected={localeSeparator}
        groupLabel="Locale Separator:"
      />
    </Hoverable>
  );
};

export default LocaleSeparatorSelector;
