import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { Dimension, ViewType } from '../../controls/PageParamTypes';
import { WritingSystemData } from '../../DataTypes';

interface Props {
  writingSystem: WritingSystemData;
}

const WritingSystemCard: React.FC<Props> = ({ writingSystem }) => {
  const { nameDisplay, code, sample, rightToLeft, unicodeVersion } = writingSystem;
  const { updatePageParams } = usePageParams();

  return (
    <div>
      <h3>
        <a
          onClick={() =>
            updatePageParams({
              code,
              viewType: ViewType.Details,
              dimension: Dimension.WritingSystem,
            })
          }
        >
          <strong>{nameDisplay}</strong> [{code}]
        </a>
      </h3>
      {rightToLeft === true && <div>Right to Left</div>}
      {unicodeVersion === null && <div>Not supported by Unicode</div>}
      {sample != null && (
        <div>
          <h4>Sample</h4>
          {sample}
        </div>
      )}
    </div>
  );
};

export default WritingSystemCard;
