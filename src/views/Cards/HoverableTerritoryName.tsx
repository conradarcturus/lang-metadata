import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { Dimension, ViewType } from '../../controls/PageParamTypes';
import { TerritoryData } from '../../DataTypes';
import Hoverable from '../../generic/Hoverable';

import TerritoryCard from './TerritoryCard';

type Props = {
  territory: TerritoryData;
  format?: 'text' | 'button';
};

const HoverableTerritoryName: React.FC<Props> = ({ territory, format = 'text' }) => {
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
      {format === 'text' ? territory.nameDisplay : <button>{territory.nameDisplay}</button>}
    </Hoverable>
  );
};

export default HoverableTerritoryName;
