import React from 'react';

import { ViewType } from '../../types/PageParamTypes';
import Selector from '../components/Selector';
import TextInput from '../components/TextInput';
import { usePageParams } from '../PageParamsContext';

const CodeFilterInput: React.FC = () => {
  const { codeFilter, dimension, updatePageParams, viewType } = usePageParams();
  if ([ViewType.Warnings, ViewType.Details].includes(viewType)) {
    // Not supported for this view
    return <></>;
  }

  return (
    <Selector
      selectorLabel="Code:"
      selectorDescription={
        viewType == ViewType.CardList
          ? `Filter the ${dimension.toLowerCase()} by its ${dimension.toLowerCase()} code.`
          : `Pick a ${dimension.toLowerCase()} to view.`
      }
    >
      <TextInput
        value={codeFilter}
        onChange={(codeFilter: string) => updatePageParams({ codeFilter })}
        inputStyle={{ width: '3em' }}
        placeholder="filter by"
      />
    </Selector>
  );
};

export default CodeFilterInput;
