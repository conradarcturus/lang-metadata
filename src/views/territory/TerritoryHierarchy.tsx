import React from 'react';

import { getViableRootEntriesFilter } from '../../controls/filter';
import { Dimension } from '../../controls/PageParamTypes';
import { getSortFunction } from '../../controls/sort';
import { useDataContext } from '../../dataloading/DataContext';
import { ObjectData, TerritoryData, TerritoryType } from '../../DataTypes';
import { TreeNodeData } from '../common/TreeList/TreeListNode';
import TreeListPageBody from '../common/TreeList/TreeListPageBody';

export const TerritoryHierarchy: React.FC = () => {
  const { territoriesByCode } = useDataContext();
  const viableEntriesFunction = getViableRootEntriesFilter();
  const sortFunction = getSortFunction();

  const rootNodes = getTerritoryTreeNodes(
    Object.values(territoriesByCode).filter(viableEntriesFunction),
    sortFunction,
  );

  return (
    <TreeListPageBody
      rootNodes={rootNodes}
      description={
        <>
          <strong>Bold territories</strong> are countries. <em>Italicized countries</em> are
          dependencies.
        </>
      }
    />
  );
};

export function getTerritoryTreeNodes(
  territories: TerritoryData[],
  sortFunction: (a: ObjectData, b: ObjectData) => number,
): TreeNodeData[] {
  return territories
    .sort(sortFunction)
    .map((territory) => getTerritoryTreeNode(territory, sortFunction));
}

function getTerritoryTreeNode(
  territory: TerritoryData,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
): TreeNodeData {
  return {
    type: Dimension.Language,
    object: territory,
    children: getTerritoryTreeNodes(territory.regionContainsTerritories, sortFunction),
    labelStyle: {
      fontWeight: territory.territoryType === TerritoryType.Country ? 'bold' : 'normal',
      fontStyle: territory.territoryType === TerritoryType.Dependency ? 'italic' : 'normal',
    },
  };
}
