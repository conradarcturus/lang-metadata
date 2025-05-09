import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import Hoverable from '../../generic/Hoverable';
import { WritingSystemData } from '../../types/DataTypes';

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
      onClick={() => updatePageParams({ modalObject: writingSystem.ID })}
      style={style}
    >
      {format === 'text' ? writingSystem.nameDisplay : <button>{writingSystem.nameDisplay}</button>}
    </Hoverable>
  );
};

export default HoverableWritingSystemName;
