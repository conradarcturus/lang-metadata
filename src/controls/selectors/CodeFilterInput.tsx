import React from 'react';

import Hoverable from '../../generic/Hoverable';
import { ViewType } from '../../types/PageParamTypes';
import { usePageParams } from '../PageParamsContext';
import TextInput from '../TextInput';

const CodeFilterInput: React.FC = () => {
  const { codeFilter, dimension, updatePageParams, viewType } = usePageParams();
  if (viewType === ViewType.Warnings) {
    // Not supported for this view
    return <></>;
  }

  return (
    <Hoverable
      hoverContent={
        viewType == ViewType.CardList
          ? `Filter the ${dimension.toLowerCase()} by its ${dimension.toLowerCase()} code.`
          : `Pick a ${dimension.toLowerCase()} to view.`
      }
    >
      <TextInput
        label="Code:"
        value={codeFilter}
        onChange={(codeFilter: string) => updatePageParams({ codeFilter })}
        inputStyle={{ width: '3em' }}
        placeholder="filter by"
      />
    </Hoverable>
  );
};

export default CodeFilterInput;
