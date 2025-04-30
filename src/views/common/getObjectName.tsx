import { Dimension } from '../../controls/PageParamTypes';
import { LanguageData, LanguageScope, ObjectData } from '../../DataTypes';
import { getLocaleName } from '../locale/LocaleStrings';

/**
 * The simple name of an object, eg. "Chinese" not "Chinese (macrolanguage)"
 */
export function getObjectName(object: ObjectData) {
  switch (object.type) {
    case Dimension.Language:
      return object.nameDisplayTitle;
    case Dimension.Locale:
      return getLocaleName(object);
    case Dimension.Territory:
      return object.nameDisplay;
    case Dimension.WritingSystem:
      return object.nameDisplay;
  }
}

export function getObjectSubtitle(object: ObjectData): string | null {
  switch (object.type) {
    case Dimension.Language:
      return getLanguageSubtitle(object);
    case Dimension.Locale:
      return null;
    case Dimension.Territory:
      return object.territoryType;
    case Dimension.WritingSystem:
      return object.nameDisplay != object.nameFull ? object.nameFull : null;
  }
}

function getLanguageSubtitle(lang: LanguageData): string | null {
  let nameDisplaySubtitle = lang.nameDisplaySubtitle;
  let scope = lang.scope;
  if (nameDisplaySubtitle === 'macrolanguage') {
    nameDisplaySubtitle = null; // Already covered by the scope argument
  }
  if (scope == LanguageScope.Language) {
    scope = null; // Not particularly interesting
  }
  const composite = [scope, nameDisplaySubtitle].filter(Boolean).join(', ');
  return composite !== '' ? composite : null;
}
