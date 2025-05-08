import React from 'react';

import { getSortFunction } from '../../controls/sort';
import CommaSeparated from '../../generic/CommaSeparated';
import { TerritoryData } from '../../types/DataTypes';
import HoverableLocaleName from '../locale/HoverableLocaleName';

import HoverableTerritoryName from './HoverableTerritoryName';

type Props = {
  territory: TerritoryData;
};

const TerritoryDetails: React.FC<Props> = ({ territory }) => {
  const {
    code,
    dependentTerritories,
    literacy,
    locales,
    parentUNRegion,
    population,
    regionContainsTerritories,
    sovereign,
  } = territory;

  return (
    <div className="Details">
      <div>
        <h3>Attributes</h3>
        <div>
          <label>Territory Code:</label>
          {code}
        </div>
        {!Number.isNaN(population) && (
          <div>
            <label>Population:</label>
            {population.toLocaleString()}
          </div>
        )}
        {!Number.isNaN(literacy) && (
          <div>
            <label>Literacy:</label>
            {literacy.toLocaleString()}%
          </div>
        )}
      </div>

      <div>
        <h3>Connections</h3>
        {locales.length > 0 && (
          <div>
            <label>Languages:</label>
            <CommaSeparated>
              {Object.values(locales).map((locale) => (
                <HoverableLocaleName key={locale.code} labelSource="language" locale={locale} />
              ))}
            </CommaSeparated>
          </div>
        )}

        {parentUNRegion != null && (
          <div>
            <label>In UN region:</label>
            <HoverableTerritoryName territory={parentUNRegion} />
          </div>
        )}
        {regionContainsTerritories.length > 0 && (
          <div>
            <label>Contains:</label>
            <CommaSeparated>
              {regionContainsTerritories.sort(getSortFunction()).map((territory) => (
                <HoverableTerritoryName key={territory.code} territory={territory} />
              ))}
            </CommaSeparated>
          </div>
        )}

        {sovereign != null && (
          <div>
            <label>Administered by:</label>
            <HoverableTerritoryName territory={sovereign} />
          </div>
        )}
        {dependentTerritories.length > 0 && (
          <div>
            <label>Administers:</label>
            <CommaSeparated>
              {dependentTerritories.sort(getSortFunction()).map((territory) => (
                <HoverableTerritoryName key={territory.code} territory={territory} />
              ))}
            </CommaSeparated>
          </div>
        )}
      </div>
    </div>
  );
};
export default TerritoryDetails;
