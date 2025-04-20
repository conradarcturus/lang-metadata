import React from 'react';
import ButtonGroupSingleChoice from './ButtonGroupSingleChoice';
import { ViewType } from './PageParamTypes';
import { usePageParams } from './PageParamsContext';
import TextInput from './TextInput';

const ControlsBar: React.FC = () => {
  const { viewType, updatePageParams, code, nameFilter } = usePageParams();

  return (
    <div className="controlsBar">
      <ButtonGroupSingleChoice<ViewType>
        options={[ViewType.CardList, ViewType.Details]}
        onChange={(viewType: ViewType) => updatePageParams({ viewType, code: '', nameFilter: '' })}
        selected={viewType}
      />
      <TextInput
        label="Code"
        value={code}
        onChange={(code: string) => updatePageParams({ code })}
        inputStyle={{ width: '3em' }}
      />
      {viewType === ViewType.CardList && (
        <TextInput
          label="Name"
          value={nameFilter}
          onChange={(nameFilter: string) => updatePageParams({ nameFilter })}
          inputStyle={{ width: '10em' }}
        />
      )}
    </div>
  );
};

export default ControlsBar;
