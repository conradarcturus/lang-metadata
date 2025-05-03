import { Dimension } from '../../controls/PageParamTypes';
import {
  LanguageCode,
  LanguageData,
  LocaleData,
  ObjectData,
  WritingSystemData,
} from '../../DataTypes';
import { getObjectName } from '../common/getObjectName';
import { TreeNodeData } from '../TreeListNode';

export function getLocaleTreeNodes(
  languages: LanguageData[],
  sortFunction: (a: ObjectData, b: ObjectData) => number,
  filterFunction: (a: ObjectData) => boolean = () => true,
): TreeNodeData[] {
  return languages
    .sort(sortFunction)
    .filter((lang) => lang.locales.length > 0 && filterFunction(lang))
    .map((lang) => ({
      type: Dimension.Locale,
      object: lang,
      label: getObjectName(lang),
      code: lang.code,
      children: getLocaleChildrenForLanguage(lang, sortFunction, filterFunction),
    }));
}

function getLocaleChildrenForLanguage(
  lang: LanguageData,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
  filterFunction: (a: ObjectData) => boolean,
): TreeNodeData[] {
  const territoryNodesWithoutWritingSystems = lang.locales
    .filter((locale) => locale.explicitScriptCode == null)
    .sort(sortFunction)
    .map(getLocaleNodeForTerritory);
  const otherWritingSystemNodes = Object.values(lang.writingSystems)
    .filter((ws) => ws.code != lang.primaryScriptCode)
    .sort(sortFunction)
    .map((writingSystem) =>
      getLocaleNodeForWritingSystem(writingSystem, lang.code, sortFunction, filterFunction),
    );

  if (lang.primaryWritingSystem) {
    const defaultWritingSystemNode = getLocaleNodeForWritingSystem(
      lang.primaryWritingSystem,
      lang.code,
      sortFunction,
      filterFunction,
    );
    defaultWritingSystemNode.children = [
      ...territoryNodesWithoutWritingSystems,
      ...defaultWritingSystemNode.children,
    ].sort((a, b) => sortFunction(a.object, b.object));
    return [defaultWritingSystemNode, ...otherWritingSystemNodes];
  }

  return [...otherWritingSystemNodes, ...territoryNodesWithoutWritingSystems];
}

function getLocaleNodeForWritingSystem(
  writingSystem: WritingSystemData,
  languageCode: LanguageCode,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
  filterFunction: (a: ObjectData) => boolean,
): TreeNodeData {
  return {
    type: Dimension.Locale,
    object: writingSystem,
    children: writingSystem.localesWhereExplicit
      .filter((locale) => locale.languageCode === languageCode)
      .sort(sortFunction)
      .map(getLocaleNodeForTerritory),
  };
}

function getLocaleNodeForTerritory(locale: LocaleData): TreeNodeData {
  return {
    type: Dimension.Locale,
    object: locale,
    children: [],
  };
}
