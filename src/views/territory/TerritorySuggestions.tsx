import React from 'react';

import { useDataContext } from '../../dataloading/DataContext';
import HoverableObjectName from '../common/HoverableObjectName';

const TerritorySuggestions: React.FC = () => {
  const { territories } = useDataContext();

  return (
    <div className="separatedButtonList">
      {['US', 'MX', 'FR', 'DE', 'CN', 'EG'].map(
        (code) =>
          territories[code] != null && (
            <HoverableObjectName key={code} object={territories[code]} format="button" />
          ),
      )}
    </div>
  );
};
export default TerritorySuggestions;
