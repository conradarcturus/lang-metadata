import React, { useMemo } from 'react';

import { usePageParams } from '../controls/PageParamsContext';
import { Dimension } from '../controls/PageParamTypes';
import { getSortFunction } from '../controls/sort';
import { useDataContext } from '../dataloading/DataContext';

import './treelist.css';
import { getLocaleTreeNodes } from './locale/LocaleTreeList';
import TreeListNode from './TreeListNode';

const ViewTreeList: React.FC = () => {
  const { dimension, limit } = usePageParams();
  const { territoriesByCode, languagesByCode } = useDataContext();
  const sortFunction = getSortFunction();

  const rootNodes = useMemo(() => {
    switch (dimension) {
      case Dimension.Language:
        return Object.values(languagesByCode)
          .filter((lang) => lang.parentLanguage == null)
          .sort(sortFunction);
      case Dimension.Territory:
        return Object.values(territoriesByCode)
          .filter((territory) => territory.parentUNRegion == null)
          .sort(sortFunction);
      case Dimension.Locale:
        // Building custom tree nodes
        return getLocaleTreeNodes(languagesByCode, sortFunction);
      default:
        return [];
    }
  }, [dimension, sortFunction]);

  return (
    <div className="TreeList">
      <ul className="root">
        {rootNodes.slice(0, limit > 0 ? limit : undefined).map((node, i) => (
          <TreeListNode key={node.code} nodeData={node} expandedInititally={i === 0} />
        ))}
      </ul>
    </div>
  );
};

export default ViewTreeList;
