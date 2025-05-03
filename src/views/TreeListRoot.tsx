import React from 'react';

import './treelist.css';
import { LanguageSchema } from '../controls/PageParamTypes';

import TreeListNode, { TreeNodeData } from './TreeListNode';

type Props = {
  rootNodes: TreeNodeData[];
  suppressExpansion?: boolean;
  languageSchema: LanguageSchema;
};

const TreeListRoot: React.FC<Props> = ({ rootNodes, suppressExpansion, languageSchema }) => {
  return (
    <ul className="TreeListRoot">
      {rootNodes.map((node, i) => (
        <TreeListNode
          key={node.code}
          nodeData={node}
          isExpandedInitially={!suppressExpansion && i === 0}
          languageSchema={languageSchema}
        />
      ))}
    </ul>
  );
};

export default TreeListRoot;
