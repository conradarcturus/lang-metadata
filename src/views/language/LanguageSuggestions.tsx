import React from 'react';

import { useDataContext } from '../../data/DataContext';
import HoverableObjectName from '../common/HoverableObjectName';

const LanguageSuggestions: React.FC = () => {
  const { languagesBySchema } = useDataContext();

  return (
    <div className="separatedButtonList">
      {['eng', 'spa', 'fra', 'deu', 'zho', 'ara'].map(
        (code) =>
          languagesBySchema.ISO[code] != null && (
            <HoverableObjectName key={code} object={languagesBySchema.ISO[code]} format="button" />
          ),
      )}
    </div>
  );
};

export default LanguageSuggestions;
