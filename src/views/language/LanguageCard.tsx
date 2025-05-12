import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import CommaSeparated from '../../generic/CommaSeparated';
import Highlightable from '../../generic/Highlightable';
import { LanguageData, LanguageScope } from '../../types/LanguageTypes';
import { SearchBy } from '../../types/PageParamTypes';
import { getObjectSubtitle } from '../common/getObjectName';
import HoverableObjectName from '../common/HoverableObjectName';

interface Props {
  lang: LanguageData;
  includeRelations?: boolean;
}

const LanguageCard: React.FC<Props> = ({ lang, includeRelations }) => {
  const { updatePageParams } = usePageParams();
  const {
    childLanguages,
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
            <Highlightable object={lang} field={SearchBy.Name} />
          </strong>{' '}
          {nameDisplay != nameEndonym && nameEndonym} [
          <Highlightable object={lang} field={SearchBy.Code} />]
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
              <HoverableObjectName key={locale.ID} labelSource="territory" object={locale} />
            ))}
          </CommaSeparated>
        </div>
      )}
      {includeRelations &&
        parentLanguage != null &&
        parentLanguage.scope != LanguageScope.Family && (
          <div>
            <h4>Group:</h4>
            <HoverableObjectName object={parentLanguage} />
          </div>
        )}
      {includeRelations && Object.keys(childLanguages).length > 0 && (
        <div>
          <h4>Includes:</h4>
          <CommaSeparated>
            {Object.values(childLanguages).map((childLanguage) => (
              <HoverableObjectName key={childLanguage.ID} object={childLanguage} />
            ))}
          </CommaSeparated>
        </div>
      )}
    </div>
  );
};

export default LanguageCard;
