import React from 'react';

import { useDataContext } from '../../dataloading/DataContext';

import HoverableTerritoryName from './HoverableTerritoryName';

const TerritorySuggestions: React.FC = () => {
  const { territories } = useDataContext();

  return (
    <div className="Details" style={{ textAlign: 'center' }}>
      No territory selected. Enter a territory code in the search bar. See common territories:
      <div className="separatedButtonList">
        {['US', 'MX', 'FR', 'DE', 'CN', 'EG'].map(
          (code) =>
            territories[code] != null && (
              <HoverableTerritoryName key={code} territory={territories[code]} format="button" />
            ),
        )}
      </div>
    </div>
  );
};
export default TerritorySuggestions;
