import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import { TerritoryData } from '../../DataTypes';
import ObjectTitle from '../ObjectTitle';

import HoverableTerritoryName from './HoverableTerritoryName';
import TerritoryDetails from './TerritoryDetails';

type Props = {
  territory?: TerritoryData;
};

const TerritoryDetailsPage: React.FC<Props> = ({ territory }) => {
  const { codeFilter } = usePageParams();
  const { territoriesByCode } = useDataContext();
  territory ??= territoriesByCode[codeFilter];

  if (territory == null) {
    return (
      <div className="Details" style={{ textAlign: 'center' }}>
        No territory selected. Enter a territory code in the search bar. See common territories:
        <div className="separatedButtonList">
          {['US', 'MX', 'FR', 'DE', 'CN', 'EG'].map(
            (code) =>
              territoriesByCode[code] != null && (
                <HoverableTerritoryName
                  key={code}
                  territory={territoriesByCode[code]}
                  format="button"
                />
              ),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="Details">
      <h2>
        <ObjectTitle object={territory} />
      </h2>
      <TerritoryDetails territory={territory} />
    </div>
  );
};
export default TerritoryDetailsPage;
