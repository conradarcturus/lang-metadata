import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { Dimension, ViewType } from '../../controls/PageParamTypes';
import { WritingSystemData } from '../../DataTypes';
import Hoverable from '../../generic/Hoverable';

import WritingSystemCard from './WritingSystemCard';

type Props = {
  writingSystem: WritingSystemData;
  format?: 'text' | 'button';
  style?: React.CSSProperties;
};

const HoverableWritingSystemName: React.FC<Props> = ({ writingSystem, format = 'text', style }) => {
  const { updatePageParams } = usePageParams();

  return (
    <Hoverable
      hoverContent={<WritingSystemCard writingSystem={writingSystem} />}
      onClick={() =>
        updatePageParams({
          code: writingSystem.code,
          viewType: ViewType.Details,
          dimension: Dimension.WritingSystem,
        })
      }
      style={style}
    >
      {format === 'text' ? writingSystem.nameDisplay : <button>{writingSystem.nameDisplay}</button>}
    </Hoverable>
  );
};

export default HoverableWritingSystemName;
