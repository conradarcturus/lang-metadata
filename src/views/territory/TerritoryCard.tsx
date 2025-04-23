import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { Dimension, ViewType } from '../../controls/PageParamTypes';
import { TerritoryData } from '../../DataTypes';
import CommaSeparated from '../../generic/CommaSeparated';
import Highlightable from '../../generic/Highlightable';
import HoverableLocaleName from '../locale/HoverableLocaleName';

import HoverableTerritoryName from './HoverableTerritoryName';

interface Props {
  territory: TerritoryData;
}

const TerritoryCard: React.FC<Props> = ({ territory }) => {
  const { nameDisplay, population, code, sovereign, territoryType, locales } = territory;
  const { updatePageParams } = usePageParams();

  return (
    <div>
      <h3>
        <a
          onClick={() =>
            updatePageParams({ code, viewType: ViewType.Details, dimension: Dimension.Territory })
          }
        >
          <strong>{<Highlightable str={nameDisplay} match="nameFilter" />}</strong> [
          <Highlightable str={code} match="codeFilter" />]
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
              <HoverableLocaleName key={locale.code} labelSource="language" locale={locale} />
            ))}
          </CommaSeparated>
        </div>
      )}

      {sovereign != null && (
        <div>
          <h4>Part of:</h4>
          <HoverableTerritoryName territory={sovereign} />
        </div>
      )}
    </div>
  );
};

export default TerritoryCard;
