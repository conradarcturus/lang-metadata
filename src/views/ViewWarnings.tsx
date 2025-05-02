import React from 'react';

import { useDataContext } from '../dataloading/DataContext';
import { LanguageData } from '../DataTypes';

import LanguageCard from './language/LanguageCard';
import ViewCard from './ViewCard';

/**
 * A page that shows tips about problems in the data that may need to be addressed
 */
const ViewWarnings: React.FC = () => {
  return (
    <>
      {' '}
      <LanguagesWithIdenticalNames />
    </>
  );
};

const LanguagesWithIdenticalNames: React.FC = () => {
  const {
    languagesBySchema: { Inclusive },
  } = useDataContext();
  const languagesByName = Object.values(Inclusive).reduce<Record<string, LanguageData[]>>(
    (languagesByName, lang) => {
      const name = lang.scope + ': ' + lang.nameDisplay + (lang.nameDisplaySubtitle ?? '');
      if (languagesByName[name] == null) {
        languagesByName[name] = [lang];
      } else {
        languagesByName[name].push(lang);
      }
      return languagesByName;
    },
    {},
  );
  const duplicatedNames = Object.entries(languagesByName).reduce<string[]>(
    (duplicatedNames, [name, langs]) => {
      if (langs.length > 1) {
        duplicatedNames.push(name);
      }
      return duplicatedNames;
    },
    [],
  );

  return (
    <div>
      <h3>Languages with Identical names</h3>
      <div>
        {duplicatedNames.map((name) => {
          const langs = languagesByName[name];
          return (
            <div key={name} style={{ textAlign: 'start' }}>
              <h3>{name}</h3>
              <div className="CardList">
                {langs.map((lang) => (
                  <ViewCard key={lang.code}>
                    <LanguageCard lang={lang} />
                  </ViewCard>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <table>
        <tr>
          <th>ISO</th> <th>Glottolog</th>
        </tr>
        <tr></tr>
      </table>
    </div>
  );
};

export default ViewWarnings;
