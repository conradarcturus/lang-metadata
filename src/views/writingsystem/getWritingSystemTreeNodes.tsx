import { Dimension } from '../../controls/PageParamTypes';
import { ObjectData, WritingSystemData } from '../../DataTypes';
import { TreeNodeData } from '../common/TreeList/TreeListNode';

export function getWritingSystemTreeNodes(
  writingSystems: WritingSystemData[],
  sortFunction: (a: ObjectData, b: ObjectData) => number,
): TreeNodeData[] {
  return writingSystems
    .sort(sortFunction)
    .map((writingSystem) => getWritingSystemTreeNode(writingSystem, sortFunction))
    .filter((node) => node != null);
}

function getWritingSystemTreeNode(
  writingSystem: WritingSystemData,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
): TreeNodeData {
  return {
    type: Dimension.WritingSystem,
    object: writingSystem,
    children: getWritingSystemTreeNodes(writingSystem.childWritingSystems, sortFunction),
    labelStyle: {
      fontWeight: writingSystem.populationOfDescendents > 100 ? 'bold' : 'normal',
      fontStyle: writingSystem.populationUpperBound <= 100 ? 'italic' : 'normal',
    },
  };
}
