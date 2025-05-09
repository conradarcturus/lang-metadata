import {
  LocaleData,
  ObjectData,
  TerritoryData,
  TerritoryType,
  WritingSystemData,
  WritingSystemScope,
} from './DataTypes';
import { LanguageData, LanguageScope } from './LanguageTypes';
import { Dimension } from './PageParamTypes';

export enum ScopeLevel {
  Groups = 'Groups', // Continents, Language Families
  Individuals = 'Individuals', // Countries, Languages
  Parts = 'Parts', // Dependencies, Dialects
  Other = 'Other', // Control Codes, No declared scope
}

export function getObjectScopeLevel(object: ObjectData): ScopeLevel {
  switch (object.type) {
    case Dimension.Language:
      return getLanguageScopeLevel(object);
    case Dimension.Locale:
      return getLocaleScopeLevel(object);
    case Dimension.Territory:
      return getTerritoryScopeLevel(object);
    case Dimension.WritingSystem:
      return getWritingSystemScopeLevel(object);
  }
}

function getLanguageScopeLevel(lang: LanguageData): ScopeLevel {
  switch (lang.scope) {
    case LanguageScope.Family:
      return ScopeLevel.Groups;
    case LanguageScope.Macrolanguage:
    case LanguageScope.Language:
      return ScopeLevel.Individuals;
    case LanguageScope.Dialect:
      return ScopeLevel.Parts;
  }
  return ScopeLevel.Other;
}

function getLocaleScopeLevel(locale: LocaleData): ScopeLevel {
  if (locale.variantTag != null) {
    return ScopeLevel.Parts;
  }
  return ScopeLevel.Individuals;
}

function getTerritoryScopeLevel(territory: TerritoryData): ScopeLevel {
  switch (territory.territoryType) {
    case TerritoryType.World:
    case TerritoryType.Continent:
    case TerritoryType.Subcontinent:
    case TerritoryType.Region:
      return ScopeLevel.Groups;
    case TerritoryType.Country:
      return ScopeLevel.Individuals;
    case TerritoryType.Dependency:
      return ScopeLevel.Parts;
  }
}

function getWritingSystemScopeLevel(writingSystem: WritingSystemData): ScopeLevel {
  switch (writingSystem.scope) {
    case WritingSystemScope.Group:
      return ScopeLevel.Groups;
    case WritingSystemScope.IndividualScript:
      return ScopeLevel.Individuals;
    case WritingSystemScope.Variation:
      return ScopeLevel.Parts;
    case WritingSystemScope.SpecialCode:
      return ScopeLevel.Other;
  }
}
