import { Dimension } from '../../controls/PageParamTypes';
import {
  LanguageCode,
  LanguageData,
  LocaleData,
  ObjectData,
  WritingSystemData,
} from '../../DataTypes';
import { filterBranch } from '../common/TreeList/filterBranch';
import { TreeNodeData } from '../common/TreeList/TreeListNode';

export function getLocaleTreeNodes(
  languages: LanguageData[],
  sortFunction: (a: ObjectData, b: ObjectData) => number,
  filterFunction?: (a: ObjectData) => boolean,
): TreeNodeData[] {
  return languages
    .sort(sortFunction)
    .filter((lang) => lang.locales.length > 0)
    .map((lang) => getLanguageTreeNode(lang, sortFunction))
    .map((node) => filterBranch(node, filterFunction))
    .filter((lang) => lang != null);
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
