import React, { useState } from 'react';

import { useDataContext } from '../../dataloading/DataContext';
import { TerritoryData, TerritoryType } from '../../DataTypes';

import HoverableTerritoryName from './HoverableTerritoryName';

const TerritoryHierarchy: React.FC = () => {
  const { territoriesByCode } = useDataContext();
  const rootTerritories = Object.values(territoriesByCode).filter(
    (territory) => territory.parentUNRegion == null,
  );

  return (
    <div className="Hierarchy">
      <ul>
        {rootTerritories.map((territory) => (
          <TerritoryNode key={territory.code} territory={territory} expandedInititally={true} />
        ))}
      </ul>
    </div>
  );
};

type TerritoryNodeProps = {
  territory: TerritoryData;
  expandedInititally?: boolean;
};

const TerritoryNode: React.FC<TerritoryNodeProps> = ({ territory, expandedInititally = false }) => {
  const [expanded, setExpanded] = useState(expandedInititally);
  const hasChildren = territory.regionContainsTerritories.length > 0;

  return (
    <li>
      {hasChildren && (
        <button onClick={() => setExpanded((prev) => !prev)}>{expanded ? `▼` : `▶`}</button>
      )}
      <HoverableTerritoryName
        territory={territory}
        style={{
          textDecoration: 'none',
          fontWeight: territory.territoryType === TerritoryType.Country ? 'bold' : 'normal',
          fontStyle: territory.territoryType === TerritoryType.Dependency ? 'italic' : 'normal',
        }}
      />
      {expanded && hasChildren && (
        <ul>
          {territory.regionContainsTerritories
            .sort((a, b) => b.population - a.population)
            .map((child, i) => (
              <TerritoryNode key={child.code} territory={child} expandedInititally={i === 0} />
            ))}
        </ul>
      )}
    </li>
  );
};

export default TerritoryHierarchy;
