import React from 'react';

import { useDataContext } from '../../dataloading/DataContext';

import HoverableWritingSystemName from './HoverableWritingSystemName';

const WritingSystemSuggestions: React.FC = () => {
  const { writingSystems } = useDataContext();

  return (
    <div className="Details" style={{ textAlign: 'center' }}>
      No writing system selected. Enter a writing system code in the search bar. See common writing
      systems:
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
};

export default WritingSystemSuggestions;
