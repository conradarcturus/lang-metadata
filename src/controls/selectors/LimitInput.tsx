import React from 'react';

import { View } from '../../types/PageParamTypes';
import Selector from '../components/Selector';
import TextInput from '../components/TextInput';
import { usePageParams } from '../PageParamsContext';

const LimitInput: React.FC = () => {
  const { limit, dimension, updatePageParams, view } = usePageParams();
  if ([View.Details, View.Notices].includes(view)) {
    // Not supported for this view
    return <></>;
  }

  return (
    <Selector
      selectorLabel="Limit:"
      selectorDescription={`Limit how many ${dimension.toLowerCase()} ${getLimitableObjectName(view)} are shown.`}
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

function getLimitableObjectName(view: View) {
  switch (view) {
    case View.CardList:
      return 'cards';
    case View.Hierarchy:
      return 'root nodes';
    case View.Details:
      return '???';
    case View.Table:
      return 'rows';
    case View.Notices:
      return 'notices';
  }
}

export default LimitInput;
