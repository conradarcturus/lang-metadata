import React from 'react';

import { useDataContext } from '../../dataloading/DataContext';
import HoverableObjectName from '../common/HoverableObjectName';

const CensusSuggestions: React.FC = () => {
  const { censuses } = useDataContext();

  return (
    <div className="separatedButtonList">
      {['Canada 2021'].map(
        (code) =>
          censuses[code] != null && (
            <HoverableObjectName key={code} object={censuses[code]} format="button" />
          ),
      )}
    </div>
  );
};

export default CensusSuggestions;
