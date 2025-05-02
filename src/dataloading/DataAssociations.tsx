import {
  BCP47LocaleCode,
  Glottocode,
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
  languagesByGlottocode: Record<Glottocode, LanguageData>,
): void {
  // Connect general parents
  Object.values(languagesByCode).forEach((lang) => {
    if (lang.parentLanguageCode != null) {
      const parentISO = languagesByCode[lang.parentISOCode || ''];
      const parentGlotto = languagesByGlottocode[lang.parentGlottocode || ''];
      if (parentGlotto) {
        parentGlotto.childGlottolangs.push(lang);
        lang.parentGlottolang = parentGlotto;

        // Make the primary parent the glottocode parent
        parentGlotto.childLanguages.push(lang);
        lang.parentLanguage = parentGlotto;
      }
      if (parentISO) {
        parentISO.childISOLangs.push(lang);
        lang.parentISOlang = parentISO;

        // If the glottolog connection failed, use the ISO parent as the general parent instead
        if (parentGlotto == null) {
          parentISO.childLanguages.push(lang);
          lang.parentLanguage = parentISO;
        }
      }
    }
  });

  // // Connect ISO language code, eg. cmn -> zho
  // Object.values(languagesByCode).forEach((lang) => {
  //   if (lang.parentLanguageCode != null) {
  //     const parent = languagesByCode[lang.parentLanguageCode];
  //     if (parent != null) {
  //       parent.childLanguages.push(lang);
  //       lang.parentLanguage = parent;
  //     } else if (lang.parentGlottocode != null) {
  //       // If we couldn't find the parent, try to find it using the glottocode
  //       const glottocodeParent = languagesByGlottocode[lang.parentGlottocode];
  //       if (glottocodeParent != null) {
  //         lang.parentLanguageCode = lang.parentGlottocode;
  //         glottocodeParent.childLanguages.push(lang);
  //         lang.parentLanguage = glottocodeParent;
  //       }
  //     }
  //   }
  // });

  // // Connect glottocode, eg. mand1415 -> mand1471
  // Object.values(languagesByGlottocode).forEach((lang) => {
  //   if (lang.parentGlottocode != null) {
  //     const parent = languagesByGlottocode[lang.parentGlottocode];
  //     if (parent != null) {
  //       parent.childGlottolangs.push(lang);
  //       lang.parentGlottolang = parent;
  //     }
  //   }
  // });
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
    const {
      primaryLanguageCode,
      territoryOfOriginCode,
      parentWritingSystemCode,
      containsWritingSystemsCodes,
    } = writingSystem;
    const language = primaryLanguageCode != null ? languagesByCode[primaryLanguageCode] : null;
    const territory =
      territoryOfOriginCode != null ? territoriesByCode[territoryOfOriginCode] : null;
    const parentWritingSystem =
      parentWritingSystemCode != null ? writingSystems[parentWritingSystemCode] : null;

    if (language != null) {
      writingSystem.primaryLanguage = language;
      writingSystem.languages[language.code] = language;
      language.writingSystems[writingSystem.code] = writingSystem;
    }
    if (territory != null) {
      writingSystem.territoryOfOrigin = territory;
    }
    if (parentWritingSystem != null) {
      writingSystem.parentWritingSystem = parentWritingSystem;
      parentWritingSystem.childWritingSystems.push(writingSystem);
    }
    if (containsWritingSystemsCodes.length > 0) {
      writingSystem.containsWritingSystems = containsWritingSystemsCodes
        .map((code) => writingSystems[code])
        .filter(Boolean);
    }
  });

  // Connect languages to their primary writing system
  Object.values(languagesByCode).forEach((language) => {
    const { primaryScriptCode } = language;
    if (primaryScriptCode != null) {
      const primaryWritingSystem = writingSystems[primaryScriptCode];
      if (primaryWritingSystem != null) {
        primaryWritingSystem.languages[language.code] = language;
        primaryWritingSystem.populationUpperBound += language.populationCited || 0;
        language.primaryWritingSystem = primaryWritingSystem;
        language.writingSystems[primaryWritingSystem.code] = primaryWritingSystem;
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
          writingSystem.populationUpperBound += locale.populationEstimate || 0;
        }
      }
    }

    // Update the locale's display name
    locale.nameDisplay = getLocaleName(locale);
  });
}

export function computeOtherPopulationStatistics(
  languages: Record<LanguageCode, LanguageData>,
  writingSystems: Record<ScriptCode, WritingSystemData>,
): void {
  // Organizing writing systems by population is a bit funny because some fundamental writing systems
  // like Egyptian have no people but writing systems that descend from then certainly do. Thereby we
  // separately compute an upper bound for how many people speak the descendents. This is safe
  // recursively because the writing system lineage is not a cycle.
  Object.values(writingSystems)
    .filter((writingSystem) => writingSystem.parentWritingSystem == null)
    .forEach(computeWritingSystemDescendentPopulation);

  // Need to compute the language descendent populations 3 times because nodes will be organized
  // differently in the different language schemas
  Object.values(languages)
    .filter((lang) => lang.parentLanguage == null)
    .forEach(computeLanguageDescendentPopulation);
  Object.values(languages)
    .filter((lang) => lang.parentISOlang == null)
    .forEach(computeISOLanguageDescendentPopulation);
  Object.values(languages)
    .filter((lang) => lang.parentGlottolang == null)
    .forEach(computeGlottoLanguageDescendentPopulation);
}

function computeWritingSystemDescendentPopulation(writingSystem: WritingSystemData): number {
  const { childWritingSystems } = writingSystem;
  const descendentPopulation = childWritingSystems.reduce(
    (total, childSystem) => total + computeWritingSystemDescendentPopulation(childSystem),
    0,
  );
  writingSystem.populationOfDescendents = descendentPopulation;
  return descendentPopulation + writingSystem.populationUpperBound;
}

function computeLanguageDescendentPopulation(lang: LanguageData): number {
  const { childLanguages } = lang;
  const descendentPopulation = childLanguages.reduce(
    (total, childLang) => total + computeLanguageDescendentPopulation(childLang),
    1,
  );
  lang.populationOfDescendents = descendentPopulation;
  return descendentPopulation + (lang.populationCited ?? 0);
}

function computeISOLanguageDescendentPopulation(lang: LanguageData): number {
  const { childISOLangs } = lang;
  const descendentPopulation = childISOLangs.reduce(
    (total, childLang) => total + computeISOLanguageDescendentPopulation(childLang),
    1,
  );
  lang.populationOfISODescendents = descendentPopulation;
  return descendentPopulation + (lang.populationCited ?? 0);
}

function computeGlottoLanguageDescendentPopulation(lang: LanguageData): number {
  const { childGlottolangs } = lang;
  const descendentPopulation = childGlottolangs.reduce(
    (total, childLang) => total + computeGlottoLanguageDescendentPopulation(childLang),
    0,
  );
  lang.populationOfGlottoDescendents = descendentPopulation;
  return descendentPopulation + (lang.populationCited ?? 0) + 1;
}
