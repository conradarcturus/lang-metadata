import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import ObjectTitle from '../ObjectTitle';

import HoverableWritingSystemName from './HoverableWritingSystemName';
import WritingSystemDetails from './WritingSystemDetails';

const WritingSystemDetailsPage: React.FC = () => {
  const { codeFilter } = usePageParams();
  const { writingSystems } = useDataContext();
  const writingSystem = writingSystems[codeFilter];

  if (writingSystem == null) {
    return (
      <div className="Details" style={{ textAlign: 'center' }}>
        No writing system selected. Enter a writing system code in the search bar. See common
        writing systems:
        <div className="separatedButtonList">
          {['Latn', 'Hans', 'Hant', 'Arab'].map(
            (code) =>
              writingSystems[code] != null && (
                <HoverableWritingSystemName
                  key={code}
                  writingSystem={writingSystems[code]}
                  format="button"
                />
              ),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="DetailsPage">
      <h2>
        <ObjectTitle object={writingSystem} />
        {writingSystem.nameFull !== writingSystem.nameDisplay && (
          <div className="subtitle">{writingSystem.nameFull}</div>
        )}
      </h2>
      <div>
        <WritingSystemDetails writingSystem={writingSystem} />
      </div>
    </div>
  );
};
export default WritingSystemDetailsPage;
