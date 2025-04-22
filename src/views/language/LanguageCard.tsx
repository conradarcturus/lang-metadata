import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { ViewType } from '../../controls/PageParamTypes';
import { LanguageData } from '../../DataTypes';
import CommaSeparated from '../../generic/CommaSeparated';
import HoverableLocaleName from '../locale/HoverableLocaleName';

import HoverableLanguageName from './HoverableLanguageName';

interface Props {
  lang: LanguageData;
  includeRelations?: boolean;
}

const LanguageCard: React.FC<Props> = ({ lang, includeRelations }) => {
  const { updatePageParams } = usePageParams();
  const {
    vitalityEth2013,
    medium,
    nameDisplayTitle,
    nameDisplaySubtitle,
    populationCited,
    nameEndonym,
    parentLanguage,
    childLanguages,
    locales,
  } = lang;

  return (
    <div>
      <h3>
        <a onClick={() => updatePageParams({ code: lang.code, viewType: ViewType.Details })}>
          <strong>{nameDisplayTitle}</strong> {nameDisplayTitle != nameEndonym && nameEndonym}
        </a>
        {nameDisplaySubtitle != null && <div className="subtitle">{nameDisplaySubtitle}</div>}
      </h3>
      <div>
        <h4>Speakers</h4>
        {populationCited.toLocaleString()}
      </div>
      <div>
        <h4>Modality</h4>
        {medium}
      </div>
      <div>
        <h4>Vitality</h4>
        {vitalityEth2013}
      </div>

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
