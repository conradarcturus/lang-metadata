import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import CommaSeparated from '../../generic/CommaSeparated';
import Highlightable from '../../generic/Highlightable';
import { LanguageData, LanguageScope } from '../../types/LanguageTypes';
import { getObjectName, getObjectSubtitle } from '../common/getObjectName';
import HoverableLocaleName from '../locale/HoverableLocaleName';

import HoverableLanguageName from './HoverableLanguageName';

interface Props {
  lang: LanguageData;
  includeRelations?: boolean;
}

const LanguageCard: React.FC<Props> = ({ lang, includeRelations }) => {
  const { updatePageParams } = usePageParams();
  const {
    childLanguages,
    codeDisplay,
    ID,
    locales,
    medium,
    nameDisplay,
    nameEndonym,
    parentLanguage,
    populationCited,
    vitalityEth2013,
  } = lang;
  const subtitle = getObjectSubtitle(lang);

  return (
    <div>
      <h3>
        <a onClick={() => updatePageParams({ objectID: ID })}>
          <strong>
            <Highlightable str={getObjectName(lang)} match="nameFilter" />
          </strong>{' '}
          {nameDisplay != nameEndonym && nameEndonym} [
          <Highlightable str={codeDisplay} match="codeFilter" />]
        </a>
        {subtitle != null && <div className="subtitle">{subtitle}</div>}
      </h3>
      {populationCited != null && (
        <div>
          <h4>Speakers</h4>
          {populationCited.toLocaleString()}
        </div>
      )}
      {medium != null && (
        <div>
          <h4>Modality</h4>
          {medium}
        </div>
      )}
      {vitalityEth2013 != null && (
        <div>
          <h4>Vitality</h4>
          {vitalityEth2013}
        </div>
      )}

      {includeRelations && locales.length > 0 && (
        <div>
          <h4>Found in:</h4>
          <CommaSeparated>
            {Object.values(locales).map((locale) => (
              <HoverableLocaleName
                key={locale.codeDisplay}
                labelSource="territory"
                locale={locale}
              />
            ))}
          </CommaSeparated>
        </div>
      )}
      {includeRelations &&
        parentLanguage != null &&
        parentLanguage.scope != LanguageScope.Family && (
          <div>
            <h4>Group:</h4>
            <HoverableLanguageName lang={parentLanguage} />
          </div>
        )}
      {includeRelations && Object.keys(childLanguages).length > 0 && (
        <div>
          <h4>Includes:</h4>
          <CommaSeparated>
            {Object.values(childLanguages).map((childLanguage) => (
              <HoverableLanguageName key={childLanguage.ID} lang={childLanguage} />
            ))}
          </CommaSeparated>
        </div>
      )}
    </div>
  );
};

export default LanguageCard;
