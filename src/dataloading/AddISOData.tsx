import {
  ISO6391LanguageCode,
  ISO6393LanguageCode,
  LanguageCode,
  LanguageData,
  LanguageScope,
} from '../DataTypes';

export enum ISOLanguageVitality {
  Living = 'Living',
  Extinct = 'Extinct',
  SpecialCode = 'Special Code',
  Constructed = 'Constructed',
  Historic = 'Historic',
}

type ISOLanguage6393Data = {
  codeISO6393: ISO6393LanguageCode; // ISO 639-3
  //   codeBibliographic: LanguageCode; // ISO 639-2b
  //   codeTerminological: LanguageCode; // ISO 639-2t
  codeISO6391: ISO6391LanguageCode | null;
  scope: LanguageScope | null;
  vitality: ISOLanguageVitality | null;
  name: string;
};

const DEBUG = false;

function getScopeFromLetterCode(code: string): LanguageScope | null {
  switch (code) {
    case 'I': // Individual language
      return LanguageScope.Language;
    case 'M':
      return LanguageScope.Macrolanguage;
    case 'S':
      return LanguageScope.SpecialCode;
    default:
      return null;
  }
}

function getVitalityFromLetterCode(code: string): ISOLanguageVitality | null {
  switch (code) {
    case 'C':
      return ISOLanguageVitality.Constructed;
    case 'E':
      return ISOLanguageVitality.Extinct;
    case 'H':
      return ISOLanguageVitality.Historic;
    case 'L':
      return ISOLanguageVitality.Living;
    case 'S':
      return ISOLanguageVitality.SpecialCode;
    default:
      return null;
  }
}

function parseISOLanguage6393Line(line: string): ISOLanguage6393Data {
  const parts = line.split('\t');
  return {
    codeISO6393: parts[0],
    // codeBibliographic: parts[1], // Not used
    // codeTerminological: parts[2], // Not used
    codeISO6391: parts[3] != '' ? parts[3] : null,
    scope: getScopeFromLetterCode(parts[4]),
    vitality: getVitalityFromLetterCode(parts[5]),
    name: parts[6],
  };
}

export async function loadISOLanguages(): Promise<ISOLanguage6393Data[] | void> {
  return await fetch('iso/languages639-3.tsv')
    .then((res) => res.text())
    .then((text) => {
      return text.split('\n').slice(1).map(parseISOLanguage6393Line);
    })
    .catch((err) => console.error('Error loading TSV:', err));
}

type ISOMacrolanguageData = {
  codeMacro: ISO6393LanguageCode;
  codeConstituent: ISO6393LanguageCode;
};

export async function loadISOMacrolanguages(): Promise<ISOMacrolanguageData[] | void> {
  return await fetch('iso/macrolanguages.tsv')
    .then((res) => res.text())
    .then((text) => {
      return text
        .split('\n')
        .slice(1)
        .map((line) => {
          const parts = line.split('\t');
          return { codeMacro: parts[0], codeConstituent: parts[1] };
        });
    })
    .catch((err) => console.error('Error loading TSV:', err));
}

export function addISODataToLanguages(
  languages: Record<LanguageCode, LanguageData>,
  isoLanguages: ISOLanguage6393Data[],
): Record<ISO6391LanguageCode, LanguageData> {
  return isoLanguages
    .map((isoLang) => {
      const lang = languages[isoLang.codeISO6393];
      if (lang == null) {
        if (DEBUG) console.log(`${isoLang.codeISO6393} not found`);
        return null;
      }

      // Fill out ISO information on the language data
      lang.codeISO6391 = isoLang.codeISO6391;
      lang.codeISO6392 = isoLang.codeISO6393;
      lang.vitalityISO = isoLang.vitality;
      lang.scope = isoLang.scope;
      return lang;
    })
    .reduce<Record<LanguageCode, LanguageData>>((languagesByISO6391Code, lang) => {
      // Produce a list of ISO 639-1 languages to be used when we need to import data that uses the ISO 639-1 code
      if (lang != null && lang.codeISO6391 != null) {
        languagesByISO6391Code[lang.codeISO6391] = lang;
      }
      return languagesByISO6391Code;
    }, {});
}

/**
 * This performs a series of steps to associate languages with macrolanguages.
 *
 * At the moment, this is redundant because the "parentLanguage" field from the main language.tsv is complete.
 * However, in the future we may drop that column from the main language table, and we should get that data from this process.
 */
export function addISOMacrolanguageData(
  languages: Record<LanguageCode, LanguageData>,
  macrolanguages: ISOMacrolanguageData[],
): void {
  macrolanguages.forEach((relation) => {
    const macro = languages[relation.codeMacro];
    const constituent = languages[relation.codeConstituent];
    if (parent == null) {
      if (DEBUG) console.log(`Macrolanguage ${relation.codeMacro} not found`);
      return;
    }
    if (constituent == null) {
      if (DEBUG) console.log(`Constituent language ${relation.codeConstituent} not found`);
      return;
    }
    if (constituent.parentLanguageCode != macro.code) {
      if (DEBUG)
        // As of 2025-04-30 all exceptions to this are temporary
        console.log(
          `parent different for ${constituent.code}. Is ${constituent.parentLanguageCode} but should be ${macro.code}`,
        );
    }
    if (macro.scope !== LanguageScope.Macrolanguage) {
      if (DEBUG)
        // As of 2025-04-30 all macrolanguage are correctly labeled above
        console.log(
          `Macrolanguage ${macro.code} should be considered a macrolanguage, instead it is a ${macro.scope}`,
        );
    }
  });
}
