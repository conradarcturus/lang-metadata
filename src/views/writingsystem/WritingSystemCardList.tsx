import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import ViewCard from '../ViewCard';

import WritingSystemCard from './WritingSystemCard';

const WritingSystemCardList: React.FC = () => {
  const { writingSystems } = useDataContext();
  const { code: codeFilter, nameFilter } = usePageParams();
  const lowercaseNameFilter = nameFilter.toLowerCase();
  const lowercaseCodeFilter = codeFilter.toLowerCase();

  const writingSystemsToShow = Object.keys(writingSystems)
    .map((writingSystemCode) => writingSystems[writingSystemCode])
    .filter(
      (writingSystem) =>
        (codeFilter === '' || writingSystem.code.toLowerCase().startsWith(lowercaseCodeFilter)) &&
        (nameFilter === '' ||
          writingSystem.nameDisplay.toLowerCase().includes(lowercaseNameFilter)),
    );
  const numberOfWritingSystemsOverall = Object.keys(writingSystems).length;

  return (
    <div>
      <div className="CardListDescription">
        Showing <strong>{writingSystemsToShow.length}</strong>
        {numberOfWritingSystemsOverall > writingSystemsToShow.length && (
          <> of {<strong>{numberOfWritingSystemsOverall}</strong>}</>
        )}{' '}
        writing systems.
      </div>
      <div className="CardList">
        {writingSystemsToShow.map((writingSystem) => (
          <ViewCard key={writingSystem.code}>
            <WritingSystemCard writingSystem={writingSystem} />
          </ViewCard>
        ))}
      </div>
    </div>
  );
};

export default WritingSystemCardList;
