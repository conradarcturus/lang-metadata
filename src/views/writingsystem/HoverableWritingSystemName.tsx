import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
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
      onClick={() => updatePageParams({ modalObject: writingSystem.code })}
      style={style}
    >
      {format === 'text' ? writingSystem.nameDisplay : <button>{writingSystem.nameDisplay}</button>}
    </Hoverable>
  );
};

export default HoverableWritingSystemName;
