import React from 'react';
import './styles.css';

import { usePageParams } from '../controls/PageParamsContext';
import { ObjectData } from '../types/DataTypes';
import { SearchBy } from '../types/PageParamTypes';

interface Props {
  object: ObjectData;
  field: SearchBy;
}

const Highlightable: React.FC<Props> = ({ object, field }) => {
  const { searchBy, searchString } = usePageParams();
  const str = field === SearchBy.Code ? object.codeDisplay : object.nameDisplay;

  if (field !== searchBy || searchString === '') {
    return str;
  }

  const result = str.match(new RegExp(`(.*)(${searchString})(.*)`, 'i'));

  return result ? (
    <>
      {result[1]}
      <span className="highlighted">{result[2]}</span>
      {result[3]}
    </>
  ) : (
    str
  );
};

export default Highlightable;
