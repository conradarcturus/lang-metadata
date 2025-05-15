import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import CommaSeparated from '../../generic/CommaSeparated';
import { ObjectData } from '../../types/DataTypes';
import { SearchBy } from '../../types/PageParamTypes';

import { getObjectSubtitle } from './getObjectName';
import SearchHighlighted from './SearchHighlighted';

type Props = {
  object: ObjectData;
  highlightSearchMatches?: boolean;
};

const ObjectTitle: React.FC<Props> = ({ object, highlightSearchMatches = false }) => {
  const { searchBy, searchString } = usePageParams();
  const objectSubtitle = getObjectSubtitle(object);
  const { codeDisplay, nameDisplay, nameEndonym } = object;

  if (!highlightSearchMatches) {
    return (
      <>
        <strong>{nameDisplay}</strong>
        {nameEndonym && nameDisplay != nameEndonym && ' ' + nameEndonym} [{codeDisplay}]
        {objectSubtitle != null && <div className="subtitle">{objectSubtitle}</div>}
      </>
    );
  }

  // Add to the subtitle are if we are searching by all names and we have to find the value by searching a new name
  let searchNamesSubtitle = null;
  if (searchBy === SearchBy.AllNames) {
    const lowercaseSearchString = searchString.toLowerCase();
    if (
      !object.nameDisplay.toLowerCase().includes(lowercaseSearchString) &&
      !object.nameEndonym?.toLowerCase().includes(lowercaseSearchString)
    ) {
      searchNamesSubtitle = (
        <>
          aka <SearchHighlighted object={object} field={SearchBy.AllNames} />
        </>
      );
    }
  }
  const subtitles = [objectSubtitle, searchNamesSubtitle].filter(Boolean);

  return (
    <>
      <strong>
        <SearchHighlighted object={object} field={SearchBy.EngName} />
      </strong>{' '}
      {nameDisplay != nameEndonym && <SearchHighlighted object={object} field={SearchBy.Endonym} />}{' '}
      [
      <SearchHighlighted object={object} field={SearchBy.Code} />]
      {subtitles.length > 0 && (
        <div className="subtitle">
          <CommaSeparated limit={null}>{subtitles}</CommaSeparated>
        </div>
      )}
    </>
  );
};

export default ObjectTitle;
