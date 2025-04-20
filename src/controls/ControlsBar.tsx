import React from 'react';
import ButtonGroupSingleChoice from '../components/ButtonGroupSingleChoice';
import { ViewType } from './PageParamTypes';
import { usePageParams } from './PageParamsContext';

const ControlsBar: React.FC = () => {
  const { viewType, updatePageParams } = usePageParams();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <ButtonGroupSingleChoice<ViewType>
        options={[ViewType.CardList, ViewType.Details]}
        onChange={(viewType: ViewType) => updatePageParams({ viewType })}
        selected={viewType}
        // renderLabel={getDataTypeLabel}
      />
    </div>
  );
};

export default ControlsBar;
