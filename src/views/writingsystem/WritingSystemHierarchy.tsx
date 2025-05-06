import React from 'react';

import { Dimension } from '../../controls/PageParamTypes';
import { getSortFunction } from '../../controls/sort';
import { useDataContext } from '../../dataloading/DataContext';
import { ObjectData, WritingSystemData } from '../../DataTypes';
import { TreeNodeData } from '../common/TreeList/TreeListNode';
import TreeListPageBody from '../common/TreeList/TreeListPageBody';

export const WritingSystemHierarchy: React.FC = () => {
  const { writingSystems } = useDataContext();
  const sortFunction = getSortFunction();

  const rootNodes = getWritingSystemTreeNodes(
    Object.values(writingSystems).filter((w) => w.parentWritingSystem == null),
    sortFunction,
  );

  return (
    <TreeListPageBody
      rootNodes={rootNodes}
      description={
        <>
          <strong>Bold writing systems</strong> historically led to other writing systems that are
          still used today. <em>Italicized writing systems</em> have few recorded users (either
          missing data or it is functionally extinct).
        </>
      }
    />
  );
};

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
