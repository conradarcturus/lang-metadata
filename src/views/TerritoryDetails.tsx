import React from 'react';
import { TerritoryData } from '../dataloading/DataTypes';
import { usePageParams } from '../controls/PageParamsContext';
import { Dimension, ViewType } from '../controls/PageParamTypes';
import CommaSeparated from '../components/CommaSeparated';
import HoverableTerritoryName from './Cards/HoverableTerritoryName';

type Props = {
  territory: TerritoryData;
};

const TerritoryDetails: React.FC<Props> = ({ territory }) => {
  const { updatePageParams } = usePageParams();

  if (territory == null) {
    return (
      <div className="Details" style={{ textAlign: 'center' }}>
        No territory selected. Enter a territory code in the search bar. See common languages:
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 8,
          }}
        >
          {Object.entries({
            US: 'United States',
            MX: 'Mexico',
            FR: 'France',
            DE: 'Germany',
            CN: 'China',
            EG: 'Egypt',
          }).map(([code, name]) => (
            <button
              key={code}
              onClick={() =>
                updatePageParams({
                  code,
                  viewType: ViewType.Details,
                  dimension: Dimension.Territory,
                })
              }
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const {
    code,
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
