import React from 'react';
import Hoverable from '../../components/Hoverable';
import { Dimension, ViewType } from '../../controls/PageParamTypes';
import { TerritoryData } from '../../dataloading/DataTypes';
import TerritoryCard from './TerritoryCard';
import { usePageParams } from '../../controls/PageParamsContext';

type Props = {
  territory: TerritoryData;
};

const HoverableTerritoryName: React.FC<Props> = ({ territory }) => {
  const { updatePageParams } = usePageParams();

  return (
    <Hoverable
      hoverContent={<TerritoryCard territory={territory} />}
      onClick={() =>
        updatePageParams({
          code: territory.code,
          viewType: ViewType.Details,
          dimension: Dimension.Territory,
        })
      }
    >
      {territory.nameDisplay}
    </Hoverable>
  );
};

export default HoverableTerritoryName;
