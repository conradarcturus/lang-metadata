import React from 'react';

import { Dimension } from '../controls/PageParamTypes';
import { DataItem } from '../DataTypes';

type Props = {
  object: DataItem;
};

const ObjectTitle: React.FC<Props> = ({ object }) => {
  switch (object.type) {
    case Dimension.Language:
      return (
        <>
          <strong>{object.nameDisplayTitle}</strong>{' '}
          {object.nameDisplayTitle != object.nameEndonym && object.nameEndonym} [{object.code}]
          {object.nameDisplaySubtitle != null && (
            <div className="subtitle">{object.nameDisplaySubtitle} </div>
          )}
        </>
      );
    case Dimension.WritingSystem:
      return (
        <>
          <strong>{object.nameDisplay}</strong>
          {object.nameDisplay != object.nameEndonym && ' ' + object.nameEndonym} [{object.code}]
          {object.nameDisplay != object.nameFull && (
            <div className="subtitle">{object.nameFull}</div>
          )}
        </>
      );
  }
  return <></>;
};

export default ObjectTitle;
