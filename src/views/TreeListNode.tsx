import React, { useState } from 'react';

import { Dimension } from '../controls/PageParamTypes';
import { LanguageData, TerritoryData, TerritoryType } from '../DataTypes';

import HoverableLanguageName from './language/HoverableLanguageName';
import HoverableTerritoryName from './territory/HoverableTerritoryName';

import './treelist.css';

type NodeData = TerritoryData | LanguageData;

type Props = {
  nodeData: NodeData;
  expandedInititally?: boolean;
};

const TreeListNode: React.FC<Props> = ({ nodeData, expandedInititally = false }) => {
  const [expanded, setExpanded] = useState(expandedInititally);
  const children = getChildren(nodeData);
  const hasChildren = children != null && children.length > 0;

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

function getChildren(nodeData: NodeData): NodeData[] | undefined {
  switch (nodeData.type) {
    case Dimension.Language:
      return nodeData.childLanguages;
    case Dimension.Territory:
      return nodeData.regionContainsTerritories;
  }
}

function getNodeTitle(nodeData: NodeData): React.ReactNode {
  switch (nodeData.type) {
    case Dimension.Language:
      return (
        <HoverableLanguageName
          lang={nodeData}
          style={{
            textDecoration: 'none',
          }}
        />
      );
    case Dimension.Territory:
      return (
        <HoverableTerritoryName
          territory={nodeData}
          style={{
            textDecoration: 'none',
            fontWeight: nodeData.territoryType === TerritoryType.Country ? 'bold' : 'normal',
            fontStyle: nodeData.territoryType === TerritoryType.Dependency ? 'italic' : 'normal',
          }}
        />
      );
  }
}

export default TreeListNode;
