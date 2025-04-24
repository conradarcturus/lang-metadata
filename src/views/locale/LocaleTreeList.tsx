import { Dimension } from '../../controls/PageParamTypes';
import {
  DataItem,
  LanguageCode,
  LanguageData,
  LocaleData,
  WritingSystemData,
} from '../../DataTypes';
import HoverableLanguageName from '../language/HoverableLanguageName';
import HoverableWritingSystemName from '../writingsystem/HoverableWritingSystem';

import HoverableLocaleName from './HoverableLocaleName';

export type LocaleTreeNodeData = {
  type: Dimension.Locale;
  level: Dimension;
  isFinal: boolean;
  label: React.ReactNode;
  code: string;
  children: LocaleTreeNodeData[];
};

export function getLocaleTreeNodes(
  languagesByCode: Record<LanguageCode, LanguageData>,
  sortFunction: (a: DataItem, b: DataItem) => number,
): LocaleTreeNodeData[] {
  return Object.values(languagesByCode)
    .sort(sortFunction)
    .filter((lang) => lang.locales.length > 0)
    .slice(0, 200)
    .map((lang) => ({
      type: Dimension.Locale,
      level: Dimension.Language,
      isFinal: false,
      label: (
        <HoverableLanguageName
          lang={lang}
          style={{
            textDecoration: 'none',
          }}
        />
      ),
      code: lang.code,
      children: getLocaleChildrenForLanguage(lang, sortFunction),
    }));
}

function getLocaleChildrenForLanguage(
  lang: LanguageData,
  sortFunction: (a: DataItem, b: DataItem) => number,
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
  sortFunction: (a: DataItem, b: DataItem) => number,
): LocaleTreeNodeData {
  return {
    type: Dimension.Locale,
    level: Dimension.WritingSystem,
    isFinal: true,
    code: writingSystem.code,
    label: (
      <HoverableWritingSystemName
        writingSystem={writingSystem}
        style={{
          textDecoration: 'none',
        }}
      />
    ),
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
    isFinal: true,
    code: locale.code,
    label: (
      <HoverableLocaleName
        locale={locale}
        labelSource="territory"
        style={{
          textDecoration: 'none',
        }}
      />
    ),
    children: [],
  };
}
