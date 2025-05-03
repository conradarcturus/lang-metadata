import { Dimension } from '../../controls/PageParamTypes';
import { ObjectData, TerritoryData, TerritoryType } from '../../DataTypes';
import { TreeNodeData } from '../common/TreeList/TreeListNode';

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
