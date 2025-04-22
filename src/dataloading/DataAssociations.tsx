import { LanguageCode, LanguageData, LocaleData, TerritoryCode, TerritoryData } from '../DataTypes';

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

/**
 * Connects locales to their languages and territories
 * @param languagesByCode - A map of language codes to LanguageData objects
 * @param territoriesByCode - A map of territory codes to TerritoryData objects
 * @param locales - An array of LocaleData objects
 *
 * @returns - The updated array of LocaleData objects -- with some locales removed, if they were missing a match to a territory or language.
 */
export function connectLocales(
  languagesByCode: Record<LanguageCode, LanguageData>,
  territoriesByCode: Record<TerritoryCode, TerritoryData>,
  locales: LocaleData[],
): LocaleData[] {
  return locales.map((locale) => {
    const territory = territoriesByCode[locale.territoryCode];
    const language = languagesByCode[locale.languageCode];

    if (territory != null) {
      territory.locales.push(locale);
      locale.territory = territory;
    }
    if (language != null) {
      language.locales.push(locale);
      locale.language = language;
    }

    return locale;
  });
}
