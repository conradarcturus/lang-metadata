import React from 'react';

import ButtonGroupSingleChoice from './ButtonGroupSingleChoice';
import { usePageParams } from './PageParamsContext';
import { DataSubset, Dimension, ViewType } from './PageParamTypes';
import TextInput from './TextInput';

const ControlsBar: React.FC = () => {
  const { dataSubset, viewType, dimension, updatePageParams, code, nameFilter } = usePageParams();

  return (
    <div className="controlsBar">
      <div>
        <ButtonGroupSingleChoice<Dimension>
          options={Object.values(Dimension)}
          onChange={(dimension: Dimension) =>
            updatePageParams({ dimension, code: '', nameFilter: '' })
          }
          selected={dimension}
        />
        <ButtonGroupSingleChoice<ViewType>
          options={Object.values(ViewType)}
          onChange={(viewType: ViewType) =>
            updatePageParams({ viewType, code: '', nameFilter: '' })
          }
          selected={viewType}
        />
        <ButtonGroupSingleChoice<DataSubset>
          options={Object.values(DataSubset)}
          onChange={(dataSubset: DataSubset) => updatePageParams({ dataSubset })}
          selected={dataSubset}
        />
      </div>
      <div>
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
    </div>
  );
};

export default ControlsBar;
