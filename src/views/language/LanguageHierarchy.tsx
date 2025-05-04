import React from 'react';

import { getViableRootEntriesFilter } from '../../controls/filter';
import { usePageParams } from '../../controls/PageParamsContext';
import { Dimension, LanguageSchema } from '../../controls/PageParamTypes';
import { getSortFunction } from '../../controls/sort';
import { useDataContext } from '../../dataloading/DataContext';
import { LanguageData, LanguageScope, ObjectData } from '../../DataTypes';
import { TreeNodeData } from '../common/TreeList/TreeListNode';
import TreeListPageBody from '../common/TreeList/TreeListPageBody';

export const LanguageHierarchy: React.FC = () => {
  const { languageSchema } = usePageParams();
  const { languagesBySchema } = useDataContext();
  const viableEntriesFunction = getViableRootEntriesFilter();
  const sortFunction = getSortFunction();

  const rootNodes = getLanguageTreeNodes(
    Object.values(languagesBySchema[languageSchema]).filter(viableEntriesFunction),
    languageSchema,
    sortFunction,
  );

  return (
    <TreeListPageBody
      rootNodes={rootNodes}
      description={
        <>
          Showing <strong>languages</strong>, language families, and <em>dialects</em>. Note that
          different people disagree on what it is a language/dialect/etc.
        </>
      }
    />
  );
};

export function getLanguageTreeNodes(
  languages: LanguageData[],
  languageSchema: LanguageSchema,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
): TreeNodeData[] {
  return languages
    .sort(sortFunction)
    .map((lang) => getLanguageTreeNode(lang, languageSchema, sortFunction))
    .filter((node) => node != null);
}

function getLanguageTreeNode(
  lang: LanguageData,
  languageSchema: LanguageSchema,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
): TreeNodeData {
  return {
    type: Dimension.Language,
    object: lang,
    children: getLanguageTreeNodes(
      lang.schemaSpecific[languageSchema].childLanguages,
      languageSchema,
      sortFunction,
    ),
    labelStyle: {
      fontWeight:
        lang.scope === LanguageScope.Language || lang.scope === LanguageScope.Macrolanguage
          ? 'bold'
          : 'normal',
      fontStyle: lang.scope === LanguageScope.Dialect ? 'italic' : 'normal',
    },
  };
}
