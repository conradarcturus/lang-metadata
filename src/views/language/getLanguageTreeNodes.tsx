import { Dimension, LanguageSchema } from '../../controls/PageParamTypes';
import { LanguageData, LanguageScope, ObjectData } from '../../DataTypes';
import { TreeNodeData } from '../TreeListNode';

export function getLanguageTreeNodes(
  languages: LanguageData[],
  languageSchema: LanguageSchema,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
  filterFunction?: (a: ObjectData) => boolean,
): TreeNodeData[] {
  return languages
    .sort(sortFunction)
    .map((lang) => getLanguageTreeNode(lang, languageSchema, sortFunction, filterFunction))
    .filter((node) => node != null);
}

function getLanguageTreeNode(
  lang: LanguageData,
  languageSchema: LanguageSchema,
  sortFunction: (a: ObjectData, b: ObjectData) => number,
  filterFunction?: (a: ObjectData) => boolean,
): TreeNodeData | undefined {
  // Get the child nodes, results may change if there is filtering involved
  const childLangs = lang.schemaSpecific[languageSchema].childLanguages;
  let childNodes: TreeNodeData[] = [];
  let startsOpen = undefined;
  if (filterFunction) {
    if (filterFunction(lang)) {
      // If it passes the filter function, show all children / remove the filter
      childNodes = getLanguageTreeNodes(childLangs, languageSchema, sortFunction);
      startsOpen = false;
    } else {
      // If it does not, only keep this if there are children that pass the filter function
      childNodes = getLanguageTreeNodes(childLangs, languageSchema, sortFunction, filterFunction);
      startsOpen = true;
      if (childNodes.length === 0) {
        return undefined;
      }
    }
  } else {
    childNodes = getLanguageTreeNodes(childLangs, languageSchema, sortFunction);
  }

  return {
    type: Dimension.Language,
    object: lang,
    children: childNodes,
    labelStyle: {
      fontWeight:
        lang.scope === LanguageScope.Language || lang.scope === LanguageScope.Macrolanguage
          ? 'bold'
          : 'normal',
      fontStyle: lang.scope === LanguageScope.Dialect ? 'italic' : 'normal',
    },
    startsOpen,
  };
}
