import {
  Glottocode,
  LanguageCode,
  LanguageData,
  LanguagesBySchema,
  LanguageScope,
} from '../types/LanguageTypes';
import { Dimension } from '../types/PageParamTypes';

const DEBUG = false;

export type GlottologData = {
  glottoCode: Glottocode;
  parentGlottocode?: Glottocode;
  name: string;
  isoCode?: LanguageCode;
  // familyGlottocode?: Glottocode;
  scope: LanguageScope;
  // latitude?: number;
  // longitude?: number;
};

function strToLanguageScope(str: string): LanguageScope {
  switch (str) {
    case 'dialect':
      return LanguageScope.Dialect;
    case 'family':
      return LanguageScope.Family;
    case 'language':
    default:
      return LanguageScope.Language;
  }
}

function parseGlottolog(line: string): GlottologData {
  const parts = line.split('\t');
  return {
    glottoCode: parts[0],
    parentGlottocode: parts[1] != '' ? parts[1] : undefined,
    name: parts[2],
    isoCode: parts[3] != '' ? parts[3] : undefined,
    // familyGlottocode: parts[4] != '' ? parts[4] : undefined,
    scope: strToLanguageScope(parts[5]),
    // latitude: parts[6] != '' ? parseFloat(parts[6]) : undefined,
    // longitude: parts[7] != '' ? parseFloat(parts[7]) : undefined,
  };
}

export async function loadGlottologLanguages(): Promise<GlottologData[] | void> {
  return await fetch('data/glottolog.tsv')
    .then((res) => res.text())
    .then((text) => text.split('\n').slice(1).map(parseGlottolog))
    .catch((err) => console.error('Error loading TSV:', err));
}

export async function loadManualGlottocodeToISO(): Promise<Record<
  Glottocode,
  LanguageCode
> | void> {
  return await fetch('data/iso/manualGlottocodeToISO.tsv')
    .then((res) => res.text())
    .then((text) =>
      text
        .split('\n')
        .slice(1)
        .map((line) => line.split('\t')),
    )
    .then(Object.fromEntries)
    .catch((err) => console.error('Error loading TSV:', err));
}

/**
 *
 * languagesBySchema.Glottolog is updated with new entries
 */
export function addGlottologLanguages(
  languagesBySchema: LanguagesBySchema,
  glottologImport: GlottologData[],
  manualGlottocodeToISO: Record<Glottocode, LanguageCode>,
): void {
  // Add the entries from the manualGlottocodeToISO to languagesBySchema.Glottolog
  Object.entries(manualGlottocodeToISO).forEach(([glottoCode, isoCode]) => {
    const glottolang = languagesBySchema.Glottolog[glottoCode];
    const isoLang = languagesBySchema.ISO[isoCode];
    if (glottolang == null && isoLang != null) {
      isoLang.schemaSpecific.Glottolog.code = glottoCode;
      languagesBySchema.Glottolog[glottoCode] = isoLang;
    }
  });

  // Add new glottocodes from the import
  glottologImport.forEach((importedLanguage) => {
    const { glottoCode, parentGlottocode, scope, name } = importedLanguage;
    const lang = languagesBySchema.Glottolog[glottoCode];
    const parentLanguageCode =
      parentGlottocode != null ? languagesBySchema.Glottolog[parentGlottocode]?.ID : undefined;

    if (lang == null) {
      // Create new LanguageData
      const schemaSpecific = {
        Inclusive: {
          code: glottoCode,
          scope,
          parentLanguageCode: parentLanguageCode ?? parentGlottocode,
          childLanguages: [],
        },
        ISO: { childLanguages: [] },
        WAL: { childLanguages: [] },
        Glottolog: {
          code: glottoCode,
          name,
          scope,
          parentLanguageCode: parentGlottocode,
          childLanguages: [],
        },
        CLDR: { childLanguages: [] },
      };
      const newLang: LanguageData = {
        type: Dimension.Language,
        ID: glottoCode,
        codeDisplay: glottoCode,
        nameCanonical: name,
        nameDisplay: name,
        names: [name],
        scope,
        viabilityConfidence: 'No',
        viabilityExplanation: 'Glottolog entry not found in ISO',
        schemaSpecific,
        writingSystems: {},
        locales: [],
        childLanguages: [],
      };
      languagesBySchema.Inclusive[glottoCode] = newLang;
      languagesBySchema.Glottolog[glottoCode] = newLang;
    } else {
      // Fill in missing data
      if (parentGlottocode != null) {
        lang.schemaSpecific.Inclusive.parentLanguageCode = parentLanguageCode ?? parentGlottocode; // Prefer original parentage
        lang.schemaSpecific.Glottolog.parentLanguageCode = parentGlottocode;
      }
      lang.schemaSpecific.Glottolog.scope = scope;
      lang.schemaSpecific.Glottolog.name = name;
      if (lang.scope == null) {
        lang.scope = scope;
      } else if (DEBUG && scope != lang.scope) {
        console.log(`${glottoCode} scope is ${scope} in glottolog but ${lang.scope} in ISO`);
      }
    }
  });
}
