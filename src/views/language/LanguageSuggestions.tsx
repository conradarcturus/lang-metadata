import React from 'react';

import { useDataContext } from '../../dataloading/DataContext';

import HoverableLanguageName from './HoverableLanguageName';

const LanguageSuggestions: React.FC = () => {
  const { languagesBySchema } = useDataContext();

  return (
    <div className="Details" style={{ textAlign: 'center' }}>
      No language selected. Enter a language code in the search bar. See common languages:
      <div className="separatedButtonList">
        {['eng', 'spa', 'fra', 'deu', 'zho', 'ara'].map(
          (code) =>
            languagesBySchema.ISO[code] != null && (
              <HoverableLanguageName
                key={code}
                lang={languagesBySchema.ISO[code]}
                format="button"
              />
            ),
        )}
      </div>
    </div>
  );
};

export default LanguageSuggestions;
