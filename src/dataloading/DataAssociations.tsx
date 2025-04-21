import { LanguageCode, LanguageData, TerritoryCode, TerritoryData } from './DataTypes';

export function connectLanguagesToParent(
  languagesByCode: Record<LanguageCode, LanguageData>,
): void {
  Object.values(languagesByCode).forEach((lang) => {
    // Connect regular language code, eg. cmn -> zho
    if (lang.parentLanguageCode != '') {
      const parent = languagesByCode[lang.parentLanguageCode];
      if (parent != null) {
        parent.childLanguages.push(lang);
        lang.parentLanguage = parent;
      }
    }
  });
}

export function connectTerritoriesToParent(
  territoriesByCode: Record<TerritoryCode, TerritoryData>,
): void {
  Object.values(territoriesByCode).forEach((territory) => {
    // Connect UN regions
    if (territory.containedUNRegionCode != '') {
      const containedUNRegion = territoriesByCode[territory.containedUNRegionCode];
      if (containedUNRegion != null) {
        containedUNRegion.regionContainsTerritories.push(territory);
        territory.parentUNRegion = containedUNRegion;
      }
    }
    // Connect dependencies to sovereigns
    if (territory.sovereignCode != '') {
      const sovereign = territoriesByCode[territory.sovereignCode];
      if (sovereign != null) {
        sovereign.dependentTerritories.push(territory);
        territory.sovereign = sovereign;
      }
    }
  });
}
