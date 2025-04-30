import React, { useState } from 'react';

import { Dimension } from '../controls/PageParamTypes';
import { getSortFunction, SortByFunctionType } from '../controls/sort';
import { LanguageData, TerritoryData, TerritoryType, WritingSystemData } from '../DataTypes';

import './treelist.css';

import { getObjectName } from './common/getObjectName';
import HoverableObject from './common/HoverableObject';
import { LocaleTreeNodeData } from './locale/LocaleTreeList';

type TreeNodeData = TerritoryData | LanguageData | LocaleTreeNodeData | WritingSystemData;

type Props = {
  nodeData: TreeNodeData;
  expandedInititally?: boolean;
};

const TreeListNode: React.FC<Props> = ({ nodeData, expandedInititally = false }) => {
  const [expanded, setExpanded] = useState(expandedInititally);
  const sortFunction = getSortFunction();
  const children = getChildren(nodeData, sortFunction);
  const hasChildren = children.length > 0;

  return (
    <li>
      {hasChildren ? (
        <button className="expandBranch" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? `▼` : `▶`}
        </button>
      ) : (
        <div className="expandBranch empty" />
      )}
      {getNodeTitle(nodeData)}
      {expanded && hasChildren && (
        <ul className="branch">
          {children.map((child, i) => (
            <TreeListNode key={child.code} nodeData={child} expandedInititally={i === 0} />
          ))}
        </ul>
      )}
    </li>
  );
};

function getChildren(nodeData: TreeNodeData, sortFunction: SortByFunctionType): TreeNodeData[] {
  switch (nodeData.type) {
    case Dimension.Language:
      return nodeData.childLanguages.sort(sortFunction);
    case Dimension.Territory:
      return nodeData.regionContainsTerritories.sort(sortFunction);
    case Dimension.Locale:
      return nodeData.children; // Presorted
    case Dimension.WritingSystem:
      return nodeData.childWritingSystems.sort(sortFunction);
  }
}

function getNodeTitle(nodeData: TreeNodeData): React.ReactNode {
  const seeMore = (
    <HoverableObject object={nodeData.type == Dimension.Locale ? nodeData.object : nodeData}>
      <button className="SeeMore">&#x24D8;</button>
    </HoverableObject>
  );

  switch (nodeData.type) {
    case Dimension.Language:
      return (
        <>
          {getObjectName(nodeData)}
          {seeMore}
        </>
      );
    case Dimension.Territory:
      return (
        <>
          <span
            style={{
              fontWeight: nodeData.territoryType === TerritoryType.Country ? 'bold' : 'normal',
              fontStyle: nodeData.territoryType === TerritoryType.Dependency ? 'italic' : 'normal',
            }}
          >
            {getObjectName(nodeData)}
          </span>
          {seeMore}
        </>
      );
    case Dimension.Locale:
      return (
        <>
          {nodeData.label}
          {seeMore}
        </>
      );
    case Dimension.WritingSystem:
      return (
        <>
          <span
            style={{
              fontWeight: nodeData.populationOfDescendents > 100 ? 'bold' : 'normal',
              fontStyle: nodeData.populationUpperBound <= 100 ? 'italic' : 'normal',
            }}
          >
            {getObjectName(nodeData)}
          </span>
          {seeMore}
        </>
      );
  }
}

export default TreeListNode;
