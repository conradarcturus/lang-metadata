import React from 'react';

import { ViewType } from '../../types/PageParamTypes';
import Selector from '../components/Selector';
import TextInput from '../components/TextInput';
import { usePageParams } from '../PageParamsContext';

const LimitInput: React.FC = () => {
  const { limit, dimension, updatePageParams, viewType } = usePageParams();
  if ([ViewType.Details, ViewType.Warnings].includes(viewType)) {
    // Not supported for this view
    return <></>;
  }

  return (
    <Selector
      selectorLabel="Limit:"
      selectorDescription={`Limit how many ${dimension.toLowerCase()} ${getLimitableObjectName(viewType)} are shown.`}
    >
      <TextInput
        inputStyle={{ width: '3em' }}
        getSuggestions={async () => [
          { id: '8', label: '8' },
          { id: '20', label: '20' },
          { id: '100', label: '100' },
          { id: '200', label: '200' },
        ]}
        onChange={(limit: string) => updatePageParams({ limit: parseInt(limit) })}
        placeholder="∞"
        value={limit < 1 || Number.isNaN(limit) ? '' : limit.toString()}
      />
    </Selector>
  );
};

function getLimitableObjectName(viewType: ViewType) {
  switch (viewType) {
    case ViewType.CardList:
      return 'cards';
    case ViewType.Hierarchy:
      return 'root nodes';
    case ViewType.Details:
      return '???';
    case ViewType.Table:
      return 'rows';
    case ViewType.Warnings:
      return 'warnings';
  }
}

export default LimitInput;
