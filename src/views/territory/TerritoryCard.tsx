import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import CommaSeparated from '../../generic/CommaSeparated';
import Highlightable from '../../generic/Highlightable';
import { TerritoryData } from '../../types/DataTypes';
import HoverableObjectName from '../common/HoverableObjectName';

interface Props {
  territory: TerritoryData;
}

const TerritoryCard: React.FC<Props> = ({ territory }) => {
  const { nameDisplay, population, ID, codeDisplay, sovereign, territoryType, locales } = territory;
  const { updatePageParams } = usePageParams();

  return (
    <div>
      <h3>
        <a onClick={() => updatePageParams({ objectID: ID })}>
          <strong>{<Highlightable str={nameDisplay} match="nameFilter" />}</strong> [
          <Highlightable str={codeDisplay} match="codeFilter" />]
          <div className="subtitle">{territoryType}</div>
        </a>
      </h3>
      <div>
        <h4>Population</h4>
        {population.toLocaleString()}
      </div>

      {locales.length > 0 && (
        <div>
          <h4>Languages:</h4>
          <CommaSeparated>
            {Object.values(locales).map((locale) => (
              <HoverableObjectName key={locale.ID} labelSource="language" object={locale} />
            ))}
          </CommaSeparated>
        </div>
      )}

      {sovereign != null && (
        <div>
          <h4>Part of:</h4>
          <HoverableObjectName object={sovereign} />
        </div>
      )}
    </div>
  );
};

export default TerritoryCard;
