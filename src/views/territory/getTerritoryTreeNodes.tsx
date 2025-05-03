import { Dimension } from '../../controls/PageParamTypes';
import { ObjectData, TerritoryData, TerritoryType } from '../../DataTypes';
import { TreeNodeData } from '../TreeListNode';

export function getTerritoryTreeNodes(
  territories: TerritoryData[],
  sortFunction: (a: ObjectData, b: ObjectData) => number,
  filterFunction: (a: ObjectData) => boolean,
): TreeNodeData[] {
  return territories
    .sort(sortFunction)
    .map((territory) => getTerritoryTreeNode(territory, sortFunction, filterFunction))
    .filter((node) => node != null);
}

function getTerritoryTreeNode(
  territory: TerritoryData,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
  filterFunction: (a: ObjectData) => boolean,
): TreeNodeData | undefined {
  const childNodes = getTerritoryTreeNodes(
    territory.regionContainsTerritories,
    sortFunction,
    filterFunction,
  );

  // If there are no children, verify that this node passes the filter function, otherwise we will leave it out
  if (childNodes.length == 0 && !filterFunction(territory)) {
    return undefined;
  }

  return {
    type: Dimension.Language,
    object: territory,
    children: childNodes,
    labelStyle: {
      fontWeight: territory.territoryType === TerritoryType.Country ? 'bold' : 'normal',
      fontStyle: territory.territoryType === TerritoryType.Dependency ? 'italic' : 'normal',
    },
  };
}
