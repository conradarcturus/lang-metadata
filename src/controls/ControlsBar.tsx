import React from 'react';
import ButtonGroupSingleChoice from './ButtonGroupSingleChoice';
import { ViewType } from './PageParamTypes';
import { usePageParams } from './PageParamsContext';

const ControlsBar: React.FC = () => {
  const { viewType, updatePageParams, code } = usePageParams();

  return (
    <div className="controlsBar">
      <ButtonGroupSingleChoice<ViewType>
        options={[ViewType.CardList, ViewType.Details]}
        onChange={(viewType: ViewType) => updatePageParams({ viewType, code: '' })}
        selected={viewType}
      />
      <div className="selector">
        <label>Code</label>
        <input value={code} onChange={(ev) => updatePageParams({ code: ev.target.value })} />
      </div>
    </div>
  );
};

export default ControlsBar;
