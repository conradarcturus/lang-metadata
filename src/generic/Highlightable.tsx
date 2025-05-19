import React from 'react';
import './styles.css';

interface Props {
  text: string;
  searchPattern: string;
}

const Highlightable: React.FC<Props> = ({ text, searchPattern }) => {
  if (searchPattern === '') {
    return text;
  }

  const searchResult = text.match(new RegExp(`(^|.*\\s)(${searchPattern})(.*)`, 'i'));

  return searchResult ? (
    <>
      {searchResult[1]}
      <span className="highlighted">{searchResult[2]}</span>
      {searchResult[3]}
    </>
  ) : (
    text
  );
};

export default Highlightable;
