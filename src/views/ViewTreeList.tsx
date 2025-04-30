import React, { useMemo } from 'react';

import { usePageParams } from '../controls/PageParamsContext';
import { Dimension } from '../controls/PageParamTypes';
import { getSortFunction } from '../controls/sort';
import { useDataContext } from '../dataloading/DataContext';

import './treelist.css';
import { getLocaleTreeNodes } from './locale/LocaleTreeList';
import TreeListRoot from './TreeListRoot';

const ViewTreeList: React.FC = () => {
  const { dimension, limit } = usePageParams();
  const { territoriesByCode, languagesByCode, writingSystems } = useDataContext();
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
        return getLocaleTreeNodes(Object.values(languagesByCode), sortFunction);
      default:
        return Object.values(writingSystems)
          .filter((writingSystem) => writingSystem.parentWritingSystem == null)
          .sort(sortFunction);
    }
  }, [dimension, sortFunction]);

  return (
    <div className="TreeListView">
      <div style={{ marginBottom: 8 }}>
        <TreeListDescription />
      </div>
      <TreeListRoot rootNodes={rootNodes.slice(0, limit > 0 ? limit : undefined)} />
    </div>
  );
};

const TreeListDescription: React.FC = () => {
  const { dimension } = usePageParams();
  switch (dimension) {
    case Dimension.Language:
      return '';
    case Dimension.Locale:
      return (
        <>
          Locales are grouped by the language/writing system/territory that is represented by the
          locale code. Most locale codes do not specify a writing system so they are grouped with
          the primary writing system for the language.
        </>
      );
    case Dimension.Territory:
      return (
        <>
          <strong>Bold territories</strong> are countries. <em>Italicized countries</em> are
          dependencies.
        </>
      );
    case Dimension.WritingSystem:
      return (
        <>
          <strong>Bold writing systems</strong> historically led to other writing systems that are
          still used today. <em>Italicized writing systems</em> have few recorded users (either
          missing data or it is functionally extinct).
        </>
      );
  }
};

export default ViewTreeList;
