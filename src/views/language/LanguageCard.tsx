import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { LanguageData } from '../../DataTypes';
import CommaSeparated from '../../generic/CommaSeparated';
import Highlightable from '../../generic/Highlightable';
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
    code,
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
        <a onClick={() => updatePageParams({ modalObject: lang.code })}>
          <strong>
            <Highlightable str={getObjectName(lang)} match="nameFilter" />
          </strong>{' '}
          {nameDisplay != nameEndonym && nameEndonym} [
          <Highlightable str={code ?? lang.code} match="codeFilter" />]
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
              <HoverableLocaleName key={locale.code} labelSource="territory" locale={locale} />
            ))}
          </CommaSeparated>
        </div>
      )}
      {includeRelations && parentLanguage != null && (
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
              <HoverableLanguageName key={childLanguage.code} lang={childLanguage} />
            ))}
          </CommaSeparated>
        </div>
      )}
    </div>
  );
};

export default LanguageCard;
