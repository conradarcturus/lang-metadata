import React from 'react';

import { useDataContext } from '../../data/DataContext';
import HoverableObjectName from '../common/HoverableObjectName';

const LocaleSuggestions: React.FC = () => {
  const { locales } = useDataContext();

  return (
    <div className="separatedButtonList">
      {['eng_US', 'spa_419', 'fra_FR', 'deu_DE', 'zho_Hans_CN', 'cmn_CN', 'arb_001'].map(
        (code) =>
          locales[code] != null && (
            <HoverableObjectName key={code} object={locales[code]} format="button" />
          ),
      )}
    </div>
  );
};

export default LocaleSuggestions;
