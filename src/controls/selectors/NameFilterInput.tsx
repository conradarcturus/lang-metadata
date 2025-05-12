import React from 'react';

import { ViewType } from '../../types/PageParamTypes';
import Selector from '../components/Selector';
import TextInput from '../components/TextInput';
import { usePageParams } from '../PageParamsContext';

const NameFilterInput: React.FC = () => {
  const { nameFilter, dimension, updatePageParams, viewType } = usePageParams();
  if (viewType === ViewType.Details) {
    // Not supported for this view
    return <></>;
  }

  return (
    <Selector
      selectorLabel="Name:"
      selectorDescription={`Filter the ${dimension.toLowerCase()} by its name. Caution: if you have too many items visible then this may jitter, so type slowly.`}
    >
      <TextInput
        value={nameFilter}
        onChange={(nameFilter: string) => updatePageParams({ nameFilter })}
        inputStyle={{ width: '10em' }}
        placeholder="filter by"
      />
    </Selector>
  );
};

export default NameFilterInput;
