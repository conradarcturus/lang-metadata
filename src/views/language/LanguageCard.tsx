import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { getSortFunction } from '../../controls/sort';
import CommaSeparated from '../../generic/CommaSeparated';
import Highlightable from '../../generic/Highlightable';
import { uniqueBy } from '../../generic/setUtils';
import { TerritoryType } from '../../types/DataTypes';
import { LanguageData } from '../../types/LanguageTypes';
import { SearchBy } from '../../types/PageParamTypes';
import { getObjectSubtitle } from '../common/getObjectName';
import HoverableObjectName from '../common/HoverableObjectName';

interface Props {
  lang: LanguageData;
  includeRelations?: boolean;
}

const LanguageCard: React.FC<Props> = ({ lang, includeRelations }) => {
  const { updatePageParams } = usePageParams();
  const sortFunction = getSortFunction();
  const { ID, locales, medium, nameDisplay, nameEndonym, populationCited, vitalityEth2013 } = lang;
  const subtitle = getObjectSubtitle(lang);
  const countryLocales = uniqueBy(
    locales.filter((l) => l.territory?.territoryType == TerritoryType.Country).sort(sortFunction),
    (l) => l.territoryCode,
  );

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

      {includeRelations && countryLocales.length > 0 && (
        <div>
          <h4>Countries:</h4>
          <CommaSeparated>
            {countryLocales.map((locale) => (
              <HoverableObjectName key={locale.ID} labelSource="territory" object={locale} />
            ))}
          </CommaSeparated>
        </div>
      )}
    </div>
  );
};

export default LanguageCard;
