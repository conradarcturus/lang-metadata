import {
  BCP47LocaleCode,
  LocaleData,
  ScriptCode,
  TerritoryCode,
  TerritoryData,
  WritingSystemData,
} from '../types/DataTypes';
import {
  LanguageData,
  LanguageDictionary,
  LanguagesBySchema,
  LanguageSchema,
  LanguageScope,
} from '../types/LanguageTypes';
import { getLocaleName } from '../views/locale/LocaleStrings';

export function connectLanguagesToParent(languagesBySchema: LanguagesBySchema): void {
  // Connect general parents
  Object.values(languagesBySchema[LanguageSchema.Inclusive]).forEach((lang) => {
    Object.values(LanguageSchema).forEach((schema) => {
      const parentCode = lang.schemaSpecific[schema].parentLanguageCode;
      if (parentCode != null) {
        const parent =
          languagesBySchema[schema][parentCode] ?? languagesBySchema.Inclusive[parentCode];
        if (parent != null) {
          lang.schemaSpecific[schema].parentLanguage = parent;
          parent.schemaSpecific[schema].childLanguages.push(lang);
        }
      }
    });
  });
}

export function connectWritingSystems(
  languages: LanguageDictionary,
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
    const language = primaryLanguageCode != null ? languages[primaryLanguageCode] : null;
    const territory =
      territoryOfOriginCode != null ? territoriesByCode[territoryOfOriginCode] : null;
    const parentWritingSystem =
      parentWritingSystemCode != null ? writingSystems[parentWritingSystemCode] : null;

    if (language != null) {
      writingSystem.primaryLanguage = language;
      writingSystem.languages[language.ID] = language;
      language.writingSystems[writingSystem.ID] = writingSystem;
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
  Object.values(languages).forEach((language) => {
    const { primaryScriptCode } = language;
    if (primaryScriptCode != null) {
      const primaryWritingSystem = writingSystems[primaryScriptCode];
      if (primaryWritingSystem != null) {
        primaryWritingSystem.languages[language.ID] = language;
        primaryWritingSystem.populationUpperBound += language.populationCited || 0;
        language.primaryWritingSystem = primaryWritingSystem;
        language.writingSystems[primaryWritingSystem.ID] = primaryWritingSystem;
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
  languages: LanguageDictionary,
  territories: Record<TerritoryCode, TerritoryData>,
  writingSystems: Record<ScriptCode, WritingSystemData>,
  locales: Record<BCP47LocaleCode, LocaleData>,
): void {
  Object.values(locales).forEach((locale) => {
    const territory = territories[locale.territoryCode];
    const language = languages[locale.languageCode];
    const writingSystem = locale.explicitScriptCode
      ? writingSystems[locale.explicitScriptCode]
      : null;

    if (territory != null) {
      territory.locales.push(locale);
      locale.territory = territory;
      locale.populationSpeakingPercent = (locale.populationSpeaking * 100) / territory.population;
    }
    if (language != null) {
      language.locales.push(locale);
      locale.language = language;
    }
    if (writingSystem != null) {
      writingSystem.localesWhereExplicit.push(locale);
      locale.writingSystem = writingSystem;

      if (language != null) {
        writingSystem.languages[language.ID] = language;
        if (language.primaryScriptCode != locale.explicitScriptCode) {
          writingSystem.populationUpperBound += locale.populationSpeaking || 0;
        }
      }
    }

    // Update the locale's display name
    locale.nameDisplay = getLocaleName(locale);
  });
}

/**
 * Recompose the structure of languages, leaving the primary index intact but also
 * creating 4 other indices based on the definitions of languages from ISO, UNESCO, Glottolog, and CLDR
 */
export function groupLanguagesBySchema(languages: LanguageDictionary): LanguagesBySchema {
  return {
    Inclusive: languages,
    ISO: Object.values(languages).reduce<LanguageDictionary>((isoLangs, lang) => {
      const code = lang.schemaSpecific.ISO.code;
      if (code != null) {
        isoLangs[code] = lang;
      }
      return isoLangs;
    }, {}),
    UNESCO: Object.values(languages).reduce<LanguageDictionary>((unescoLangs, lang) => {
      const code = lang.schemaSpecific.UNESCO.code;
      if (code != null && lang.viabilityConfidence != null && lang.viabilityConfidence != 'No') {
        unescoLangs[code] = lang;
      }
      return unescoLangs;
    }, {}),
    Glottolog: Object.values(languages).reduce<LanguageDictionary>((glottoLangs, lang) => {
      const code = lang.schemaSpecific.Glottolog.code;
      if (code != null) {
        glottoLangs[code] = lang;
      }
      return glottoLangs;
    }, {}),
    CLDR: Object.values(languages).reduce<LanguageDictionary>((cldrLangs, lang) => {
      const code = lang.codeISO6391 ?? lang.schemaSpecific.ISO.code;
      if (code != null && lang.scope !== LanguageScope.Family) {
        cldrLangs[code] = lang;
      }
      return cldrLangs;
    }, {}),
  };
}

export function computeOtherPopulationStatistics(
  languagesBySchema: LanguagesBySchema,
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
  Object.values(LanguageSchema).forEach((schema) => {
    Object.values(languagesBySchema[schema])
      .filter((lang) => lang.schemaSpecific[schema].parentLanguage == null) // start at roots
      .forEach((lang) => computeLanguageDescendentPopulation(lang, schema));
  });
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

function computeLanguageDescendentPopulation(lang: LanguageData, schema: LanguageSchema): number {
  const { childLanguages } = lang.schemaSpecific[schema];
  const descendentPopulation = childLanguages.reduce(
    (total, childLang) => total + computeLanguageDescendentPopulation(childLang, schema),
    1,
  );
  lang.schemaSpecific[schema].populationOfDescendents = descendentPopulation;
  return descendentPopulation + (lang.populationCited ?? 0) + 1; // Tiebreaker = number of child nodes
}
