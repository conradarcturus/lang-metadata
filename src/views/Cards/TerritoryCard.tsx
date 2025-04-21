import React from 'react';
import { TerritoryData } from '../../dataloading/DataTypes';
import { ViewType } from '../../controls/PageParamTypes';
import { usePageParams } from '../../controls/PageParamsContext';

interface Props {
  territory: TerritoryData;
}

const TerritoryCard: React.FC<Props> = ({ territory }) => {
  const { nameDisplay, population, code } = territory;
  const { updatePageParams } = usePageParams();

  return (
    <div>
      <h3>
        <a onClick={() => updatePageParams({ code, viewType: ViewType.Details })}>
          <strong>{nameDisplay}</strong>
        </a>
      </h3>
      <div>
        <h4>Population</h4>
        {population.toLocaleString()}
      </div>
    </div>
  );
};

export default TerritoryCard;
