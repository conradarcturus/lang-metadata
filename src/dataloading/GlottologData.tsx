import { Dimension } from '../controls/PageParamTypes';
import { Glottocode, LanguageCode, LanguageData, LanguageScope } from '../DataTypes';

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

export async function loadLangoids(): Promise<GlottologData[] | void> {
  return await fetch('glottolog.tsv')
    .then((res) => res.text())
    .then((text) => text.split('\n').slice(1).map(parseGlottolog))
    .catch((err) => console.error('Error loading TSV:', err));
}

export function addGlottologLanguages(
  languagesByCode: Record<LanguageCode, LanguageData>,
  glottologImport: GlottologData[],
): Record<Glottocode, LanguageData> {
  // First initialize the index of glottolog languoids
  const languagesByGlottocode = Object.values(languagesByCode).reduce<
    Record<Glottocode, LanguageData>
  >((languagesByGlottocode, lang) => {
    const { glottocode } = lang;
    if (glottocode) {
      languagesByGlottocode[glottocode] = lang;
    }
    return languagesByGlottocode;
  }, {});

  // Then add new glottocodes from the import
  glottologImport.forEach((importedLanguage) => {
    let glottolang = languagesByGlottocode[importedLanguage.glottoCode];

    if (glottolang == null) {
      // Create new LanguageData
      glottolang = {
        type: Dimension.Language,
        code: importedLanguage.glottoCode,
        glottocode: importedLanguage.glottoCode,
        nameDisplay: importedLanguage.name,
        nameDisplayTitle: importedLanguage.name,
        scope: importedLanguage.scope,
        viabilityConfidence: 'No',
        viabilityExplanation: 'Glottolog entry not found in ISO',
        parentLanguageCode: importedLanguage.parentGlottocode,
        parentGlottocode: importedLanguage.parentGlottocode,

        childLanguages: [],
        childGlottolangs: [],
        writingSystems: {},
        locales: [],
      };
      languagesByGlottocode[importedLanguage.glottoCode] = glottolang;
      languagesByCode[importedLanguage.glottoCode] = glottolang;
    } else {
      // Fill in missing data
      if (importedLanguage.parentGlottocode != null) {
        glottolang.parentGlottocode = importedLanguage.parentGlottocode;
        if (glottolang.parentLanguageCode == null) {
          glottolang.parentLanguageCode = importedLanguage.parentGlottocode;
        }
      }
      if (glottolang.scope == null) {
        glottolang.scope = importedLanguage.scope;
      } else if (DEBUG && importedLanguage.scope != glottolang.scope) {
        console.log(
          `${importedLanguage.glottoCode} scope is ${importedLanguage.scope} in glottolog but ${glottolang.scope} in ISO`,
        );
      }
    }
  });

  return languagesByGlottocode;
}

export function connectGlottolangsToParent(
  languagesByGlottocode: Record<Glottocode, LanguageData>,
): void {
  Object.values(languagesByGlottocode).forEach((lang) => {
    // Connect glottocode, eg. mand1415 -> mand1471
    if (lang.parentGlottocode != null) {
      const parent = languagesByGlottocode[lang.parentGlottocode];
      if (parent != null) {
        parent.childGlottolangs.push(lang);
        lang.parentGlottolang = parent;
      }
    }
  });
}
