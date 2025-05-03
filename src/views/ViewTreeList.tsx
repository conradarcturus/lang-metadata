import React, { useMemo } from 'react';

import { getSubstringFilter, getViableRootEntriesFilter } from '../controls/filter';
import { usePageParams } from '../controls/PageParamsContext';
import { Dimension } from '../controls/PageParamTypes';
import { getSortFunction } from '../controls/sort';
import { useDataContext } from '../dataloading/DataContext';

import './treelist.css';
import { getLanguageTreeNodes } from './language/getLanguageTreeNodes';
import { getLocaleTreeNodes } from './locale/LocaleTreeList';
import { getTerritoryTreeNodes } from './territory/getTerritoryTreeNodes';
import TreeListRoot from './TreeListRoot';
import { getWritingSystemTreeNodes } from './writingsystem/getWritingSystemTreeNodes';

const ViewTreeList: React.FC = () => {
  const { dimension, limit, languageSchema } = usePageParams();
  const { territoriesByCode, languagesBySchema, writingSystems } = useDataContext();
  const sortFunction = getSortFunction();
  const viableEntriesFunction = getViableRootEntriesFilter();
  const substringFilterFunction = getSubstringFilter();

  const rootNodes = useMemo(() => {
    switch (dimension) {
      case Dimension.Language:
        return getLanguageTreeNodes(
          Object.values(languagesBySchema[languageSchema]).filter(viableEntriesFunction),
          languageSchema,
          sortFunction,
          substringFilterFunction,
        );
      case Dimension.Locale:
        return getLocaleTreeNodes(Object.values(languagesBySchema[languageSchema]), sortFunction);
      case Dimension.Territory:
        return getTerritoryTreeNodes(
          Object.values(territoriesByCode).filter(viableEntriesFunction),
          sortFunction,
          substringFilterFunction,
        );
      case Dimension.WritingSystem:
        return getWritingSystemTreeNodes(
          Object.values(writingSystems).filter(viableEntriesFunction),
          sortFunction,
          substringFilterFunction,
        );
    }
  }, [dimension, sortFunction, viableEntriesFunction]);

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
      return (
        <>
          Showing <strong>languages</strong>, language families, and <em>dialects</em>. Note that
          different people disagree on what it is a language/dialect/etc.
        </>
      );
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
