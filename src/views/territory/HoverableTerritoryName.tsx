import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import Hoverable from '../../generic/Hoverable';
import { TerritoryData } from '../../types/DataTypes';

import TerritoryCard from './TerritoryCard';

type Props = {
  territory: TerritoryData;
  format?: 'text' | 'button';
  style?: React.CSSProperties;
};

const HoverableTerritoryName: React.FC<Props> = ({ territory, format = 'text', style }) => {
  const { updatePageParams } = usePageParams();

  return (
    <Hoverable
      hoverContent={<TerritoryCard territory={territory} />}
      onClick={() => updatePageParams({ modalObject: territory.code })}
      style={style}
    >
      {format === 'text' ? territory.nameDisplay : <button>{territory.nameDisplay}</button>}
    </Hoverable>
  );
};

export default HoverableTerritoryName;
