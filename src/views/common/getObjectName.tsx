import { Dimension } from '../../controls/PageParamTypes';
import { ObjectData } from '../../DataTypes';
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
