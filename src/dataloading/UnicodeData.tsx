import { CLDRAliasImport, CLDRCoverageLevel, CLDRCoverageImport } from '../types/CLDRTypes';
import { LanguagesBySchema, LanguageScope } from '../types/LanguageTypes';
import { Dimension } from '../types/PageParamTypes';

import { CoreData } from './CoreData';

const DEBUG = false;

export async function loadCLDRAliases(): Promise<CLDRAliasImport[] | void> {
  return await fetch('unicode/cldrAliases.tsv')
    .then((res) => res.text())
    .then((text) => {
      return text
        .split('\n')
        .map(parseCLDRAliasLine)
        .filter((row) => row != null);
    })
    .catch((err) => console.error('Error loading TSV:', err));
}

function parseCLDRAliasLine(line: string): CLDRAliasImport | undefined {
  const parts = line.match(
    /<([^A]+)Alias type="([^"]+)" replacement="([^"]+)"\s+reason="([^"]+)"\/>(?:\W*<!-- (.+) -->)?/,
  );
  if (parts == null || parts.length < 6) {
    // Drop rows that are comments
    return undefined;
  }
  let dimension = null;
  if (parts[1] === 'language') {
    dimension = Dimension.Language;
  } else if (parts[1] === 'script') {
    dimension = Dimension.WritingSystem;
  } else if (parts[1] === 'territory') {
    dimension = Dimension.Territory;
  }
  if (dimension == null) {
    return undefined;
  }

  return {
    dimension,
    original: parts[2],
    replacement: parts[3],
    reason: parts[4],
    comment: parts[5],
  };
}

export function addCLDRLanguageSchema(
  languagesBySchema: LanguagesBySchema,
  cldrAliases: CLDRAliasImport[],
): void {
  const cldrLanguages = languagesBySchema.CLDR;
  // const langCodesToReplacement = cldrAliases
  //   .filter((alias) => alias.dimension === Dimension.Language)
  //   .reduce<Record<LanguageCode, CLDRAliasRow>>((langCodesToReplacement, alias) => {
  //     langCodesToReplacement[alias.original] = alias;
  //     return langCodesToReplacement;
  //   }, {});
  // console.log(langCodesToReplacement);

  // Go through all "overlong" aliases. We already handled most of them by using ISO 639-1 two-letter codes but a few
  // more exist, in particular eg. swc -> sw_CD and prs -> fa_AF
  cldrAliases
    .filter((alias) => alias.reason === 'overlong' && alias.dimension === Dimension.Language)
    .forEach((alias) => {
      const lang = cldrLanguages[alias.original];
      if (DEBUG && lang != null) {
        console.log('CLDR import', alias, lang);
        // TODO: support locales in CLDR better
      }
    });

  // Then go through the macrolanguage entries.
  // Macrolanguage replacements actually completely replace the parent language
  // For example, "zh" usually means "Chinese (macrolanguage)" but in CLDR it functionally means cmn "Mandarin Chinese"
  // This is because the macrolanguage tag is better known and of the macrolanguage's consistuents, Mandarin Chinese
  // is the most dominant. Thereby, the canonical entry for "cmn" in the langauge data is functionally "zh" in CLDR.
  cldrAliases
    .filter((alias) => alias.reason === 'macrolanguage' && alias.dimension === Dimension.Language)
    .forEach((alias) => {
      // Does the dominant language for the macrolanguage (eg. cmn) exist?
      const lang = cldrLanguages[alias.original];

      // Does the macrolanguage entry (eg. zh) exist?
      if (lang != null && cldrLanguages[alias.replacement] != null) {
        // Remove the symbolic reference but mark the replacement code (eg. cmn) as the parent
        cldrLanguages[alias.replacement].schemaSpecific.CLDR.parentLanguageCode =
          lang.codeCanonical;
        cldrLanguages[alias.replacement].schemaSpecific.CLDR.scope = LanguageScope.Macrolanguage;
        delete cldrLanguages[alias.replacement];
      }

      // Now set the replacement (cmn) as the canonical language for its macrolanguage (zh)
      if (lang != null) {
        cldrLanguages[alias.replacement] = lang;
        lang.schemaSpecific.CLDR = {
          code: alias.replacement,
          childLanguages: [],
        };

        // Remove the old link (eg. from cmn) since it's now canonical for the macrolanguage code (zh)
        delete cldrLanguages[alias.original];
      } else {
        // Looks like `him` and `srx` are missing -- perhaps they are discontinued codes
        if (DEBUG) console.log(alias);
      }
    });

  languagesBySchema.CLDR = cldrLanguages;
}

export async function loadCLDRCoverage(coreData: CoreData): Promise<void> {
  const cldrLanguages = coreData.languagesBySchema.CLDR;

  return await fetch('unicode/cldrCoverage.tsv')
    .then((res) => res.text())
    .then((text) => {
      const SKIP_THREE_HEADER_ROWS = 3;
      const cldrCoverage = text
        .split('\n')
        .slice(SKIP_THREE_HEADER_ROWS)
        .map(parseCLDRCoverageLine);
      cldrCoverage.forEach((cldrCov) => {
        const lang = cldrLanguages[cldrCov.languageCode];
        if (lang == null) {
          console.log('During CLDR import ', cldrCov.languageCode, 'missing from languages');
          return;
        }
        if (cldrCov.explicitScriptCode != null) {
          // If there is an explicit script code then drop the data for now
          // TODO add information to locales
          return;
        }
        lang.cldrCoverage = {
          countOfCLDRLocales: cldrCov.countOfCLDRLocales,
          targetCoverageLevel: cldrCov.targetCoverageLevel,
          actualCoverageLevel: cldrCov.actualCoverageLevel,
          inICU: cldrCov.inICU,
        };
      });
    })
    .catch((err) => console.error('Error loading TSV:', err));
}

function parseCLDRCoverageLine(line: string): CLDRCoverageImport {
  const parts = line.split('\t');
  const [languageCode, scriptCode] = parts[0].split('_');

  return {
    // Most of this data is not used yet
    languageCode: languageCode,
    explicitScriptCode: scriptCode,
    nameDisplay: parts[1],
    nameEndonym: parts[2],
    scriptDefaultCode: parts[3],
    territoryDefaultCode: parts[4],
    countOfCLDRLocales: Number.parseInt(parts[5]),
    targetCoverageLevel: parts[6] !== '' ? (parts[6] as CLDRCoverageLevel) : CLDRCoverageLevel.Core,
    actualCoverageLevel: parts[8] !== '' ? (parts[8] as CLDRCoverageLevel) : CLDRCoverageLevel.Core,
    inICU: parts[9] === 'ICU',
    percentOfValuesConfirmed: Number.parseFloat(parts[10]),
    percentOfModernValuesComplete: Number.parseFloat(parts[11]),
    percentOfModerateValuesComplete: Number.parseFloat(parts[12]),
    percentOfBasicValuesComplete: Number.parseFloat(parts[13]),
    percentOfCoreValuesComplete: Number.parseFloat(parts[14]),
    missingFeatures: parts[15]?.split(', '),
  };
}
