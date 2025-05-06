import React from 'react';

import Hoverable from '../../generic/Hoverable';
import { TABLE_MAX_ROWS } from '../../views/common/table/ObjectTable';
import { usePageParams } from '../PageParamsContext';
import { ViewType } from '../PageParamTypes';
import TextInput from '../TextInput';

const LimitInput: React.FC = () => {
  const { limit, dimension, updatePageParams, viewType } = usePageParams();
  if ([ViewType.Details, ViewType.Warnings].includes(viewType)) {
    // Not supported for this view
    return <></>;
  }

  return (
    <Hoverable
      hoverContent={`Limit how many ${dimension.toLowerCase()} ${getLimitableObjectName(viewType)} are shown.`}
    >
      <TextInput
        label="Limit:"
        value={limit < 1 || Number.isNaN(limit) ? '' : limit.toString()}
        onChange={(limit: string) => updatePageParams({ limit: parseInt(limit) })}
        inputStyle={{ width: '3em' }}
        placeholder={viewType === ViewType.Table ? TABLE_MAX_ROWS.toString() : '∞'}
      />
    </Hoverable>
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
