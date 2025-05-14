import React from 'react';

import { ObjectData } from '../../types/DataTypes';

import { getObjectSubtitle } from './getObjectName';

type Props = {
  object: ObjectData;
};

const ObjectTitle: React.FC<Props> = ({ object }) => {
  const subtitle = getObjectSubtitle(object);
  const { codeDisplay, nameDisplay, nameEndonym } = object;
  return (
    <>
      <strong>{nameDisplay}</strong>
      {nameEndonym && nameDisplay != nameEndonym && ' ' + nameEndonym} [{codeDisplay}]
      {subtitle != null && <div className="subtitle">{subtitle}</div>}
    </>
  );
};

export default ObjectTitle;
