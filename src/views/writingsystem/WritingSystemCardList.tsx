import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import ViewCard from '../ViewCard';
import VisibleItemsMeter from '../VisibleItemsMeter';

import WritingSystemCard from './WritingSystemCard';

const WritingSystemCardList: React.FC = () => {
  const { writingSystems } = useDataContext();
  const { code: codeFilter, nameFilter, limit } = usePageParams();
  const lowercaseNameFilter = nameFilter.toLowerCase();
  const lowercaseCodeFilter = codeFilter.toLowerCase();

  // Filter results
  const writingSystemsFiltered = Object.keys(writingSystems)
    .map((writingSystemCode) => writingSystems[writingSystemCode])
    .filter(
      (writingSystem) =>
        (codeFilter === '' || writingSystem.code.toLowerCase().startsWith(lowercaseCodeFilter)) &&
        (nameFilter === '' ||
          writingSystem.nameDisplay.toLowerCase().includes(lowercaseNameFilter)),
    );
  // Sort results & limit how many are visible
  const writingSystemsVisible = writingSystemsFiltered
    .sort((a, b) => b.populationUpperBound - a.populationUpperBound)
    .slice(0, limit > 0 ? limit : undefined);

  return (
    <div>
      <div className="CardListDescription">
        <VisibleItemsMeter
          nShown={writingSystemsVisible.length}
          nFiltered={writingSystemsFiltered.length}
          nOverall={Object.keys(writingSystems).length}
          nounPlural="writing systems"
        />
      </div>
      <div className="CardList">
        {writingSystemsVisible.map((writingSystem) => (
          <ViewCard key={writingSystem.code}>
            <WritingSystemCard writingSystem={writingSystem} />
          </ViewCard>
        ))}
      </div>
    </div>
  );
};

export default WritingSystemCardList;
