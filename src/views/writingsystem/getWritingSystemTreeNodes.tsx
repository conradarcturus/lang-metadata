import { Dimension } from '../../controls/PageParamTypes';
import { ObjectData, WritingSystemData } from '../../DataTypes';
import { TreeNodeData } from '../TreeListNode';

export function getWritingSystemTreeNodes(
  writingSystems: WritingSystemData[],
  sortFunction: (a: ObjectData, b: ObjectData) => number,
  filterFunction: (a: ObjectData) => boolean,
): TreeNodeData[] {
  return writingSystems
    .sort(sortFunction)
    .map((writingSystem) => getWritingSystemTreeNode(writingSystem, sortFunction, filterFunction))
    .filter((node) => node != null);
}

function getWritingSystemTreeNode(
  writingSystem: WritingSystemData,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
  filterFunction: (a: ObjectData) => boolean,
): TreeNodeData | undefined {
  const childNodes = getWritingSystemTreeNodes(
    writingSystem.childWritingSystems,
    sortFunction,
    filterFunction,
  );

  // If there are no children, verify that this node passes the filter function, otherwise we will leave it out
  if (childNodes.length == 0 && !filterFunction(writingSystem)) {
    return undefined;
  }

  return {
    type: Dimension.WritingSystem,
    object: writingSystem,
    children: childNodes,
    labelStyle: {
      fontWeight: writingSystem.populationOfDescendents > 100 ? 'bold' : 'normal',
      fontStyle: writingSystem.populationUpperBound <= 100 ? 'italic' : 'normal',
    },
  };
}
