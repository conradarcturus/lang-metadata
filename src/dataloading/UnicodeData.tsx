import { CLDRCoverageLevel, CLDRCoverageImport } from '../types/CLDRTypes';

import { CoreData } from './CoreData';

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
        lang.cldr = {
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
