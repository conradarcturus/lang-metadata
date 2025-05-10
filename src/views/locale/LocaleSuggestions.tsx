import React from 'react';

import { useDataContext } from '../../dataloading/DataContext';
import HoverableObjectName from '../common/HoverableObjectName';

const LocaleSuggestions: React.FC = () => {
  const { locales } = useDataContext();

  return (
    <div className="Details" style={{ textAlign: 'center' }}>
      No locale selected. Enter a locale code in the search bar. See common locales:
      <div className="separatedButtonList">
        {['eng_US', 'spa_419', 'fra_FR', 'deu_DE', 'zho_Hans_CN', 'cmn_CN', 'arb_001'].map(
          (code) =>
            locales[code] != null && (
              <HoverableObjectName key={code} object={locales[code]} format="button" />
            ),
        )}
      </div>
    </div>
  );
};

export default LocaleSuggestions;
