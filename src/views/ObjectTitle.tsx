import React from 'react';

import { Dimension } from '../controls/PageParamTypes';
import { ObjectData } from '../DataTypes';

import { getObjectSubtitle } from './common/getObjectName';
import { getLocaleName } from './locale/LocaleStrings';

type Props = {
  object: ObjectData;
};

const ObjectTitle: React.FC<Props> = ({ object }) => {
  const subtitle = getObjectSubtitle(object);

  switch (object.type) {
    case Dimension.Language:
      return (
        <>
          <strong>{object.nameDisplayTitle}</strong>{' '}
          {object.nameDisplayTitle != object.nameEndonym && object.nameEndonym} [{object.code}]
          {subtitle != null && <div className="subtitle">{subtitle} </div>}
        </>
      );
    case Dimension.Locale:
      return (
        <>
          <strong>{getLocaleName(object)}</strong> [{object.code}]
        </>
      );
    case Dimension.Territory:
      return (
        <>
          <strong>{object.nameDisplay}</strong> [{object.code}]
          <div className="subtitle">{subtitle}</div>
        </>
      );
    case Dimension.WritingSystem:
      return (
        <>
          <strong>{object.nameDisplay}</strong>
          {object.nameDisplay != object.nameEndonym && ' ' + object.nameEndonym} [{object.code}]
          {subtitle != null && <div className="subtitle">{subtitle}</div>}
        </>
      );
  }
};

export default ObjectTitle;
