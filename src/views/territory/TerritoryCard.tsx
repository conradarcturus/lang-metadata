import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import CommaSeparated from '../../generic/CommaSeparated';
import { TerritoryData } from '../../types/DataTypes';
import HoverableObjectName from '../common/HoverableObjectName';
import ObjectTitle from '../common/ObjectTitle';

interface Props {
  territory: TerritoryData;
}

const TerritoryCard: React.FC<Props> = ({ territory }) => {
  const { population, ID, sovereign, locales } = territory;
  const { updatePageParams } = usePageParams();

  return (
    <div>
      <h3>
        <a onClick={() => updatePageParams({ objectID: ID })}>
          <ObjectTitle object={territory} highlightSearchMatches={true} />
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
