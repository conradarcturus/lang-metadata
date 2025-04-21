import React from 'react';
import { TerritoryData } from '../../dataloading/DataTypes';
import { Dimension, ViewType } from '../../controls/PageParamTypes';
import { usePageParams } from '../../controls/PageParamsContext';
import HoverableTerritoryName from './HoverableTerritoryName';

interface Props {
  territory: TerritoryData;
}

const TerritoryCard: React.FC<Props> = ({ territory }) => {
  const { nameDisplay, population, code, sovereign, territoryType } = territory;
  const { updatePageParams } = usePageParams();

  return (
    <div>
      <h3>
        <a
          onClick={() =>
            updatePageParams({ code, viewType: ViewType.Details, dimension: Dimension.Territory })
          }
        >
          <strong>{nameDisplay}</strong>
          <div className="subtitle">{territoryType}</div>
        </a>
      </h3>
      <div>
        <h4>Population</h4>
        {population.toLocaleString()}
      </div>

      {sovereign != null && (
        <div>
          <h4>Part of:</h4>
          <HoverableTerritoryName territory={sovereign} />
        </div>
      )}
    </div>
  );
};

export default TerritoryCard;
