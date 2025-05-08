import { ObjectData } from '../../types/DataTypes';
import { LanguageData, LanguageScope } from '../../types/LanguageTypes';
import { Dimension } from '../../types/PageParamTypes';
import { getLocaleName } from '../locale/LocaleStrings';

/**
 * The simple name of an object, eg. "Chinese" not "Chinese (macrolanguage)"
 */
export function getObjectName(object: ObjectData) {
  switch (object.type) {
    case Dimension.Language:
      return object.nameDisplay;
    case Dimension.Locale:
      return getLocaleName(object);
    case Dimension.Territory:
      return object.nameDisplay;
    case Dimension.WritingSystem:
      return object.nameDisplay;
  }
}

export function getObjectSubtitle(object: ObjectData): string | undefined {
  switch (object.type) {
    case Dimension.Language:
      return getLanguageSubtitle(object);
    case Dimension.Locale:
      return undefined;
    case Dimension.Territory:
      return object.territoryType;
    case Dimension.WritingSystem:
      return object.nameDisplay != object.nameFull ? object.nameFull : undefined;
  }
}

function getLanguageSubtitle(lang: LanguageData): string | undefined {
  let nameSubtitle: string | undefined = lang.nameDisplay;
  let scope = lang.scope;
  if (nameSubtitle === 'macrolanguage') {
    nameSubtitle = undefined; // Already covered by the scope argument
  }
  if (scope == LanguageScope.Language) {
    scope = undefined; // Not particularly interesting
  }
  const composite = [scope, nameSubtitle].filter(Boolean).join(', ');
  return composite !== '' ? composite : undefined;
}
