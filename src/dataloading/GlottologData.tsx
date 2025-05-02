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

export async function loadGlottologLanguages(): Promise<GlottologData[] | void> {
  return await fetch('glottolog.tsv')
    .then((res) => res.text())
    .then((text) => text.split('\n').slice(1).map(parseGlottolog))
    .catch((err) => console.error('Error loading TSV:', err));
}

export async function loadManualGlottocodeToISO(): Promise<Record<
  Glottocode,
  LanguageCode
> | void> {
  return await fetch('iso/manualGlottocodeToISO.tsv')
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

export function addGlottologLanguages(
  languagesByCode: Record<LanguageCode, LanguageData>,
  glottologImport: GlottologData[],
  manualGlottocodeToISO: Record<Glottocode, LanguageCode>,
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
    let lang = languagesByGlottocode[importedLanguage.glottoCode];

    // If we were not able to fetch it -- maybe the glottolog list doesn't have the ISO
    // but we can get it from the manual soruce
    if (lang == null) {
      const manualISO = manualGlottocodeToISO[importedLanguage.glottoCode];
      if (manualISO != null && languagesByCode[manualISO] != null) {
        lang = languagesByCode[manualISO];
        lang.glottocode = importedLanguage.glottoCode;
        languagesByGlottocode[importedLanguage.glottoCode] = lang;
      }
    }

    if (lang == null) {
      // Create new LanguageData
      lang = {
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
        childISOLangs: [],
        childGlottolangs: [],
        writingSystems: {},
        locales: [],
      };
      languagesByGlottocode[importedLanguage.glottoCode] = lang;
      languagesByCode[importedLanguage.glottoCode] = lang;
    } else {
      // Fill in missing data
      if (importedLanguage.parentGlottocode != null) {
        lang.parentGlottocode = importedLanguage.parentGlottocode;
        if (lang.parentLanguageCode == null) {
          lang.parentLanguageCode = importedLanguage.parentGlottocode;
        }
      }
      if (lang.scope == null) {
        lang.scope = importedLanguage.scope;
      } else if (DEBUG && importedLanguage.scope != lang.scope) {
        console.log(
          `${importedLanguage.glottoCode} scope is ${importedLanguage.scope} in glottolog but ${lang.scope} in ISO`,
        );
      }
    }
  });

  return languagesByGlottocode;
}
