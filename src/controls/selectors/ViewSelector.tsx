import React from 'react';

import ButtonGroupSingleChoice from '../ButtonGroupSingleChoice';
import { usePageParams } from '../PageParamsContext';
import { ViewType } from '../PageParamTypes';

const ViewSelector: React.FC = () => {
  const { viewType, updatePageParams } = usePageParams();

  return (
    <ButtonGroupSingleChoice<ViewType>
      options={[ViewType.CardList, ViewType.Hierarchy]}
      onChange={(viewType: ViewType) => updatePageParams({ viewType })}
      selected={viewType}
      getOptionDescription={() => (
        <>
          Decide how you want to view the data.
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <label>Card List:</label>
              <div>
                <img src="cardlist.png" width={200} />
              </div>
            </div>
            <div>
              <label>Hierarchy:</label>
              <div>
                <img src="hierarchy.png" width={200} />
              </div>
            </div>
          </div>
        </>
      )}
    />
  );
};

export default ViewSelector;
