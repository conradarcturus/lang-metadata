import React from 'react';

import Hoverable from '../../generic/Hoverable';
import { ViewType } from '../../types/PageParamTypes';
import { usePageParams } from '../PageParamsContext';
import TextInput from '../TextInput';

const NameFilterInput: React.FC = () => {
  const { nameFilter, dimension, updatePageParams, viewType } = usePageParams();
  if (viewType === ViewType.Details) {
    // Not supported for this view
    return <></>;
  }

  return (
    <Hoverable
      hoverContent={`Filter the ${dimension.toLowerCase()} by its name. Caution: if you have too many items visible then this may jitter, so type slowly.`}
    >
      <TextInput
        label="Name:"
        value={nameFilter}
        onChange={(nameFilter: string) => updatePageParams({ nameFilter })}
        inputStyle={{ width: '10em' }}
        placeholder="filter by"
      />
    </Hoverable>
  );
};

export default NameFilterInput;
