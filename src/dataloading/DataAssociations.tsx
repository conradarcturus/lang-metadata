import {
  BCP47LocaleCode,
  LanguageCode,
  LanguageData,
  LocaleData,
  ScriptCode,
  TerritoryCode,
  TerritoryData,
  WritingSystemData,
} from '../DataTypes';
import { getLocaleName } from '../views/locale/LocaleStrings';

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

export function connectWritingSystems(
  languagesByCode: Record<LanguageCode, LanguageData>,
  territoriesByCode: Record<TerritoryCode, TerritoryData>,
  writingSystems: Record<ScriptCode, WritingSystemData>,
): void {
  // Connect the writing systems their origin language and territory
  Object.values(writingSystems).forEach((writingSystem) => {
    const { primaryLanguageCode, territoryOfOriginCode } = writingSystem;
    const language = primaryLanguageCode != null ? languagesByCode[primaryLanguageCode] : null;
    const territory =
      territoryOfOriginCode != null ? territoriesByCode[territoryOfOriginCode] : null;

    if (language != null) {
      writingSystem.primaryLanguage = language;
      writingSystem.languages[language.code] = language;
      language.writingSystems[writingSystem.code] = writingSystem;
    }
    if (territory != null) {
      writingSystem.territoryOfOrigin = territory;
    }
  });

  // Connect languages to their primary writing system
  Object.values(languagesByCode).forEach((language) => {
    const { primaryScriptCode } = language;
    const primaryWritingSystem = writingSystems[primaryScriptCode];
    if (primaryWritingSystem != null) {
      primaryWritingSystem.languages[language.code] = language;
      primaryWritingSystem.populationUpperBound += language.populationCited || 0;
      language.primaryWritingSystem = primaryWritingSystem;
      language.writingSystems[primaryWritingSystem.code] = primaryWritingSystem;
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
  writingSystems: Record<ScriptCode, WritingSystemData>,
  locales: Record<BCP47LocaleCode, LocaleData>,
): void {
  Object.values(locales).forEach((locale) => {
    const territory = territoriesByCode[locale.territoryCode];
    const language = languagesByCode[locale.languageCode];
    const writingSystem = locale.explicitScriptCode
      ? writingSystems[locale.explicitScriptCode]
      : null;

    if (territory != null) {
      territory.locales.push(locale);
      locale.territory = territory;
      locale.populationPercentOfTerritory =
        (locale.populationEstimate * 100) / territory.population;
    }
    if (language != null) {
      language.locales.push(locale);
      locale.language = language;
    }
    if (writingSystem != null) {
      writingSystem.localesWhereExplicit.push(locale);
      locale.writingSystem = writingSystem;

      if (language != null) {
        writingSystem.languages[language.code] = language;
        if (language.primaryScriptCode != locale.explicitScriptCode) {
          writingSystem.populationUpperBound += locale.populationEstimate;
        }
      }
    }

    // Update the locale's display name
    locale.nameDisplay = getLocaleName(locale);
  });
}
