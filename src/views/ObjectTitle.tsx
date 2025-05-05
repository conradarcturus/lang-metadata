import React from 'react';

import { ObjectData } from '../DataTypes';

import { getObjectName, getObjectSubtitle } from './common/getObjectName';

type Props = {
  object: ObjectData;
};

const ObjectTitle: React.FC<Props> = ({ object }) => {
  const nameDisplay = getObjectName(object);
  const subtitle = getObjectSubtitle(object);
  const { code, nameEndonym } = object;
  return (
    <>
      <strong>{nameDisplay}</strong>
      {nameDisplay != nameEndonym && ' ' + nameEndonym} [{code}]
      {subtitle != null && <div className="subtitle">{subtitle}</div>}
    </>
  );
};

export default ObjectTitle;
