import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import CommaSeparated from '../../generic/CommaSeparated';
import HoverableTerritoryName from '../cards/HoverableTerritoryName';

const TerritoryDetails: React.FC = () => {
  const { code } = usePageParams();
  const { territoriesByCode } = useDataContext();
  const territory = territoriesByCode[code];

  if (territory == null) {
    return (
      <div className="Details" style={{ textAlign: 'center' }}>
        No territory selected. Enter a territory code in the search bar. See common territories:
        <div className="separatedButtonList">
          {['US', 'MX', 'FR', 'DE', 'CN', 'EG'].map(
            (code) =>
              territoriesByCode[code] != null && (
                <HoverableTerritoryName
                  key={code}
                  territory={territoriesByCode[code]}
                  format="button"
                />
              ),
          )}
        </div>
      </div>
    );
  }

  const {
    dependentTerritories,
    literacy,
    nameDisplay,
    parentUNRegion,
    population,
    regionContainsTerritories,
    sovereign,
    territoryType,
  } = territory;

  return (
    <div className="Details">
      <h2>
        {nameDisplay}
        <div className="subtitle">{territoryType}</div>
      </h2>
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
              {regionContainsTerritories.map((territory) => (
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
              {dependentTerritories.map((territory) => (
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
