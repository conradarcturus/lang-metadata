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

  const searchResult = text.match(
    new RegExp(`(^|.*\\W)(${searchPattern})(?:(.*\\W)(${searchPattern}))*(.*)`, 'i'),
  );

  return searchResult ? (
    <>
      {searchResult.slice(1).map((part, i) =>
        i % 2 === 0 ? (
          part
        ) : (
          <span key={i} className="highlighted">
            {part}
          </span>
        ),
      )}
    </>
  ) : (
    text
  );
};

export default Highlightable;
