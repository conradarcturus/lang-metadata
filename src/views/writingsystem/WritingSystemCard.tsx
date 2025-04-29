import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { Dimension, ViewType } from '../../controls/PageParamTypes';
import { WritingSystemData } from '../../DataTypes';
import CommaSeparated from '../../generic/CommaSeparated';
import Highlightable from '../../generic/Highlightable';
import HoverableLanguageName from '../language/HoverableLanguageName';

interface Props {
  writingSystem: WritingSystemData;
}

const WritingSystemCard: React.FC<Props> = ({ writingSystem }) => {
  const {
    code,
    languages,
    nameDisplay,
    populationUpperBound,
    rightToLeft,
    sample,
    unicodeVersion,
  } = writingSystem;
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
          <strong>{<Highlightable str={nameDisplay} match="nameFilter" />}</strong> [
          <Highlightable str={code} match="codeFilter" />]
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
      {Object.values(languages).length > 0 && (
        <div>
          <label>Languages:</label>
          <CommaSeparated>
            {Object.values(languages).map((lang) => (
              <HoverableLanguageName key={lang.code} lang={lang} />
            ))}
          </CommaSeparated>
        </div>
      )}
      {populationUpperBound > 100 && ( // Values less than 100 are suspcious and probably spurious
        <div>
          <label>Population (estimate, at most):</label>
          {populationUpperBound.toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default WritingSystemCard;
