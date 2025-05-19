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

  // \P{L} = non-letter character. Preferred over \s because it works better for unicode characters
  const searchResult = text.match(
    new RegExp(`(^|.*\\P{L})(${searchPattern})(?:(.*\\P{L})(${searchPattern}))*(.*)`, 'iu'),
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
