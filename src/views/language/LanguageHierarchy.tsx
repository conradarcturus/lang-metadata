import React, { useState } from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import { LanguageData } from '../../DataTypes';

import HoverableLanguageName from './HoverableLanguageName';

const LanguageHierarchy: React.FC = () => {
  const { languagesByCode } = useDataContext();
  const { limit } = usePageParams();
  const rootLanguages = Object.values(languagesByCode)
    .filter((language) => language.parentLanguage == null)
    .sort((a, b) => b.populationCited - a.populationCited)
    .slice(0, limit > 0 ? limit : undefined);

  return (
    <div className="Hierarchy">
      <ul>
        {rootLanguages.map((language) => (
          <LanguageNode key={language.code} language={language} expandedInititally={true} />
        ))}
      </ul>
    </div>
  );
};

type LanguageNodeProps = {
  language: LanguageData;
  expandedInititally?: boolean;
};

const LanguageNode: React.FC<LanguageNodeProps> = ({ language, expandedInititally = false }) => {
  const [expanded, setExpanded] = useState(expandedInititally);
  const hasChildren = language.childLanguages.length > 0;

  return (
    <li>
      {hasChildren && (
        <button onClick={() => setExpanded((prev) => !prev)}>{expanded ? `▼` : `▶`}</button>
      )}
      <HoverableLanguageName
        lang={language}
        style={{
          textDecoration: 'none',
        }}
      />
      {expanded && hasChildren && (
        <ul>
          {language.childLanguages
            .sort((a, b) => b.populationCited - a.populationCited)
            .map((child, i) => (
              <LanguageNode key={child.code} language={child} expandedInititally={i === 0} />
            ))}
        </ul>
      )}
    </li>
  );
};

export default LanguageHierarchy;
