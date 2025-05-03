import { Dimension, LanguageSchema } from '../../controls/PageParamTypes';
import { LanguageData, LanguageScope, ObjectData } from '../../DataTypes';
import { TreeNodeData } from '../common/TreeList/TreeListNode';

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
