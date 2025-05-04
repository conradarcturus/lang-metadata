import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { Dimension } from '../../controls/PageParamTypes';
import { getSortFunction } from '../../controls/sort';
import { useDataContext } from '../../dataloading/DataContext';
import {
  LanguageCode,
  LanguageData,
  LocaleData,
  ObjectData,
  WritingSystemData,
} from '../../DataTypes';
import { TreeNodeData } from '../common/TreeList/TreeListNode';
import TreeListPageBody from '../common/TreeList/TreeListPageBody';

export const LocaleHierarchy: React.FC = () => {
  const { languageSchema } = usePageParams();
  const { languagesBySchema } = useDataContext();
  const sortFunction = getSortFunction();

  const rootNodes = getLocaleTreeNodes(
    Object.values(languagesBySchema[languageSchema]),
    sortFunction,
  );

  return (
    <TreeListPageBody
      rootNodes={rootNodes}
      description={
        <>
          Locales are grouped by the language/writing system/territory that is represented by the
          locale code. Most locale codes do not specify a writing system so they are grouped with
          the primary writing system for the language.
        </>
      }
    />
  );
};

export function getLocaleTreeNodes(
  languages: LanguageData[],
  sortFunction: (a: ObjectData, b: ObjectData) => number,
): TreeNodeData[] {
  return languages
    .sort(sortFunction)
    .filter((lang) => lang.locales.length > 0)
    .map((lang) => getLanguageTreeNode(lang, sortFunction));
}

function getLanguageTreeNode(
  lang: LanguageData,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
): TreeNodeData {
  return {
    type: Dimension.Locale,
    object: lang,
    children: getWritingSystemNodesForLanguage(lang, sortFunction),
  };
}

// Note the filterFunction here is causing some problems. EG if you search for Latin then you see which languages support latin but not which
function getWritingSystemNodesForLanguage(
  lang: LanguageData,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
): TreeNodeData[] {
  const territoryNodesWithoutWritingSystems = lang.locales
    .filter((locale) => locale.explicitScriptCode == null)
    .sort(sortFunction)
    .map((territory) => getLocaleNodeForTerritory(territory));
  const otherWritingSystemNodes = Object.values(lang.writingSystems)
    .filter((ws) => ws.code != lang.primaryScriptCode)
    .sort(sortFunction)
    .map((writingSystem) => getLocaleNodeForWritingSystem(writingSystem, lang.code, sortFunction));

  if (lang.primaryWritingSystem) {
    const defaultWritingSystemNode = getLocaleNodeForWritingSystem(
      lang.primaryWritingSystem,
      lang.code,
      sortFunction,
    );
    defaultWritingSystemNode.children = [
      ...territoryNodesWithoutWritingSystems,
      ...defaultWritingSystemNode.children,
    ].sort((a, b) => sortFunction(a.object, b.object));

    // Put the default writing system first, then the rest
    return [defaultWritingSystemNode, ...otherWritingSystemNodes];
  }

  // Otherwise somehow we don't know what writing system the unspecified locales should use
  // So we put them at the same level, after the writing systems
  return [...otherWritingSystemNodes, ...territoryNodesWithoutWritingSystems];
}

function getLocaleNodeForWritingSystem(
  writingSystem: WritingSystemData,
  languageCode: LanguageCode,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
): TreeNodeData {
  return {
    type: Dimension.Locale,
    object: writingSystem,
    children: getTerritoryNodesForWritingSystem(writingSystem, languageCode, sortFunction),
  };
}

function getTerritoryNodesForWritingSystem(
  writingSystem: WritingSystemData,
  languageCode: LanguageCode,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
): TreeNodeData[] {
  return writingSystem.localesWhereExplicit
    .filter((locale) => locale.languageCode === languageCode)
    .sort(sortFunction)
    .map((locale) => getLocaleNodeForTerritory(locale));
}

function getLocaleNodeForTerritory(locale: LocaleData): TreeNodeData {
  return {
    type: Dimension.Locale,
    object: locale,
    children: [],
  };
}
