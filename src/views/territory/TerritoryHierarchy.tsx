import React from 'react';

import { getScopeFilter } from '../../controls/filter';
import { Dimension } from '../../controls/PageParamTypes';
import { getSortFunction } from '../../controls/sort';
import { useDataContext } from '../../dataloading/DataContext';
import { ObjectData, TerritoryData, TerritoryType } from '../../DataTypes';
import { TreeNodeData } from '../common/TreeList/TreeListNode';
import TreeListPageBody from '../common/TreeList/TreeListPageBody';

export const TerritoryHierarchy: React.FC = () => {
  const { territoriesByCode } = useDataContext();
  const sortFunction = getSortFunction();
  const filterByScope = getScopeFilter();

  const rootNodes = getTerritoryTreeNodes(
    Object.values(territoriesByCode).filter(
      (t) => t.parentUNRegion == null || !filterByScope(t.parentUNRegion),
    ),
    sortFunction,
    filterByScope,
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
  filterByScope: (a: ObjectData) => boolean,
): TreeNodeData[] {
  return territories
    .sort(sortFunction)
    .filter(filterByScope)
    .map((territory) => getTerritoryTreeNode(territory, sortFunction, filterByScope));
}

function getTerritoryTreeNode(
  territory: TerritoryData,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
  filterByScope: (a: ObjectData) => boolean,
): TreeNodeData {
  return {
    type: Dimension.Language,
    object: territory,
    children: getTerritoryTreeNodes(
      territory.regionContainsTerritories,
      sortFunction,
      filterByScope,
    ),
    labelStyle: {
      fontWeight: territory.territoryType === TerritoryType.Country ? 'bold' : 'normal',
      fontStyle: territory.territoryType === TerritoryType.Dependency ? 'italic' : 'normal',
    },
  };
}
