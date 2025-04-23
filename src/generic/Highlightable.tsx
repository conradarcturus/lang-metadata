import React from 'react';
import './styles.css';

import { usePageParams } from '../controls/PageParamsContext';

interface Props {
  str: string;
  match: 'codeFilter' | 'nameFilter';
}

const Highlightable: React.FC<Props> = ({ str, match }) => {
  const { code: codeFilter, nameFilter } = usePageParams();
  const filter = match == 'codeFilter' ? codeFilter : nameFilter;
  if (filter === '') {
    return str;
  }

  const result = str.match(new RegExp(`(.*)(${filter})(.*)`, 'i'));

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
