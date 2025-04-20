/**
 * This file provides asynchronous functions to load in data
 */

import { LanguageCode, LanguageData } from './DataTypes';

function parseLanguageLine(line: string): LanguageData {
  const parts = line.split('\t');
  return {
    code: parts[0],
    glottocode: parts[1],
    nameDisplay: parts[2],
    nameEndonym: parts[3],
    medium: parts[4],
    script: parts[5],
    vitalityEth2013: parts[6],
    vitalityEth2025: parts[7],
    digitalSupport: parts[8],
    populationAdjusted: Number.parseInt(parts[9].replace(/,/g, '')),
    populationCited: Number.parseInt(parts[10].replace(/,/g, '')),
    parentLanguageCode: parts[11],
    parentGlottocode: parts[12],
    viabilityConfidence: parts[13],
    viabilityExplanation: parts[14],

    // References to other objects, filled in with DataAssociations methods
    parentLanguage: undefined,
    childLanguages: [],
  };
}

export async function loadLanguages(): Promise<Record<LanguageCode, LanguageData> | void> {
  const filename = 'languages200.tsv';

  return await fetch(filename)
    .then((res) => res.text())
    .then((text) => {
      const languages = text.split('\n').slice(1).map(parseLanguageLine);
      return languages.reduce<Record<LanguageCode, LanguageData>>((languagesByCode, lang) => {
        languagesByCode[lang.code] = lang;
        return languagesByCode;
      }, {});
    })
    .catch((err) => console.error('Error loading TSV:', err));
}
