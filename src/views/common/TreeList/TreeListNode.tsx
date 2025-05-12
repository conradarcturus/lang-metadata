import React, { useEffect, useState } from 'react';

import { usePageParams } from '../../../controls/PageParamsContext';
import Highlightable from '../../../generic/Highlightable';
import { ObjectData } from '../../../types/DataTypes';
import { Dimension, SearchBy, ViewType } from '../../../types/PageParamTypes';
import HoverableObject from '../HoverableObject';

import './treelist.css';

export type TreeNodeData = {
  children: TreeNodeData[];
  object: ObjectData;
  type: Dimension;
  labelStyle?: React.CSSProperties;
  descendentsPassFilter?: boolean;
};

type Props = {
  nodeData: TreeNodeData;
  isExpandedInitially?: boolean;
};

const TreeListNode: React.FC<Props> = ({ nodeData, isExpandedInitially = false }) => {
  const { children, object, labelStyle, descendentsPassFilter } = nodeData;
  const { viewType, searchBy, searchString } = usePageParams();
  const [expanded, setExpanded] = useState(isExpandedInitially || descendentsPassFilter);
  const [seeAllChildren, setSeeAllChildren] = useState(false);
  const { limit } = usePageParams();

  // Update the initial opening if a user is typing things in the search box
  useEffect(
    () => setExpanded(isExpandedInitially || descendentsPassFilter),
    [descendentsPassFilter],
  );

  return (
    <li>
      {children.length > 0 ? (
        <button
          className="TreeListExpandBranch"
          onClick={() => {
            setExpanded((prev) => !prev);
            setSeeAllChildren(false);
          }}
        >
          {expanded ? `▼` : `▶`}
        </button>
      ) : (
        <div className="TreeListExpandBranch empty" />
      )}
      <>
        <span style={labelStyle}>
          <Highlightable object={object} field={SearchBy.Name} />
        </span>
        {searchString != '' && searchBy === SearchBy.Code && viewType === ViewType.Hierarchy && (
          <>
            {' '}
            [<Highlightable object={object} field={SearchBy.Code} />]
          </>
        )}
        <HoverableObject object={object}>
          <button className="InfoButton">&#x24D8;</button>
        </HoverableObject>
      </>
      {expanded && children.length > 0 && (
        <ul className="TreeListBranch">
          {children.slice(0, limit > 0 && !seeAllChildren ? limit : undefined).map((child, i) => (
            <TreeListNode key={child.object.ID} nodeData={child} isExpandedInitially={i === 0} />
          ))}
          {limit > 0 && children.length > limit && !seeAllChildren && (
            <li>
              <button
                className="TreeListSeeAllDescendents"
                onClick={() => setSeeAllChildren((prev) => !prev)}
              >
                See {children.length - limit} more descendents
              </button>
            </li>
          )}
        </ul>
      )}
    </li>
  );
};

export default TreeListNode;
