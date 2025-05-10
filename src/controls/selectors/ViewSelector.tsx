import React from 'react';

import { ViewType } from '../../types/PageParamTypes';
import ButtonGroupSingleChoice from '../ButtonGroupSingleChoice';
import { usePageParams } from '../PageParamsContext';

const ViewSelector: React.FC = () => {
  const { viewType, updatePageParams } = usePageParams();

  return (
    <ButtonGroupSingleChoice<ViewType>
      options={[
        ViewType.CardList,
        ViewType.Details,
        ViewType.Hierarchy,
        ViewType.Table,
        ViewType.Warnings,
      ]}
      onChange={(viewType: ViewType) => updatePageParams({ viewType, objectID: undefined })}
      selected={viewType}
      getOptionDescription={() => (
        <>
          Decide how you want to view the data.
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <label>Card List:</label>
              <div>
                <img src="cardlist.png" width={180} />
              </div>
            </div>
            <div>
              <label>Details:</label>
              <div>
                <img src="details.png" width={180} />
              </div>
            </div>
            <div>
              <label>Hierarchy:</label>
              <div>
                <img src="hierarchy.png" width={180} />
              </div>
            </div>
            <div>
              <label>Table:</label>
              <div>
                <img src="table.png" width={180} />
              </div>
            </div>
            <div>
              <label>Warnings:</label>
              <div>
                <img src="warnings.png" width={180} />
              </div>
            </div>
          </div>
        </>
      )}
    />
  );
};

export default ViewSelector;
