import { Dimension } from '../../controls/PageParamTypes';
import {
  LanguageCode,
  LanguageData,
  LocaleData,
  ObjectData,
  WritingSystemData,
} from '../../DataTypes';
import { getObjectName } from '../common/getObjectName';

export type LocaleTreeNodeData = {
  children: LocaleTreeNodeData[];
  code: string;
  label: React.ReactNode;
  level: Dimension;
  object: ObjectData;
  type: Dimension.Locale;
};

export function getLocaleTreeNodes(
  languages: LanguageData[],
  sortFunction: (a: ObjectData, b: ObjectData) => number,
): LocaleTreeNodeData[] {
  return languages
    .sort(sortFunction)
    .filter((lang) => lang.locales.length > 0)
    .slice(0, 200)
    .map((lang) => ({
      type: Dimension.Locale,
      level: Dimension.Language,
      object: lang,
      label: getObjectName(lang),
      code: lang.code,
      children: getLocaleChildrenForLanguage(lang, sortFunction),
    }));
}

function getLocaleChildrenForLanguage(
  lang: LanguageData,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
): LocaleTreeNodeData[] {
  const territoryNodesWithoutWritingSystems = lang.locales
    .filter((locale) => locale.explicitScriptCode == null)
    .sort(sortFunction)
    .map(getLocaleNodeForTerritory);
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
    ];
    return [defaultWritingSystemNode, ...otherWritingSystemNodes];
  }

  return [...otherWritingSystemNodes, ...territoryNodesWithoutWritingSystems];
}

function getLocaleNodeForWritingSystem(
  writingSystem: WritingSystemData,
  languageCode: LanguageCode,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
): LocaleTreeNodeData {
  return {
    type: Dimension.Locale,
    level: Dimension.WritingSystem,
    object: writingSystem,
    code: writingSystem.code,
    label: getObjectName(writingSystem),
    children: writingSystem.localesWhereExplicit
      .filter((locale) => locale.languageCode === languageCode)
      .sort(sortFunction)
      .map(getLocaleNodeForTerritory),
  };
}

function getLocaleNodeForTerritory(locale: LocaleData): LocaleTreeNodeData {
  return {
    type: Dimension.Locale,
    level: Dimension.Territory,
    object: locale,
    code: locale.code,
    label: locale.territory?.nameDisplay ?? locale.territoryCode,
    children: [],
  };
}
