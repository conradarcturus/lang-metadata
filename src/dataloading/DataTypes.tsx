/**
 * This file provides types for the data used in the application.
 * It includes types for language codes, glottocodes, and language data.
 */

// LanguageCode is ideally an ISO-639 code, or a BCP047 formatted complex language tag
// should be formatted like ab or abc. But there are some languoids with different
// kinds of language codes here as well. This is the main index key for languages and languoids
// TODO Replace generic strings with some form of validation
export type LanguageCode = string;

// Glottocodes come from Glottolog. They should be formatted like abcd1234
export type Glottocode = string;

export type LanguageData = {
  // Provided by the TSV files
  code: LanguageCode;
  glottocode: Glottocode;
  nameDisplay: string;
  nameEndonym: string;
  medium: string;
  script: string;
  vitalityEth2013: string;
  vitalityEth2025: string;
  digitalSupport: string;
  populationAdjusted: number;
  populationCited: number;
  parentLanguageCode: LanguageCode;
  parentGlottocode: Glottocode;
  viabilityConfidence: string;
  viabilityExplanation: string;

  // References to other objects, filled in after loading the TSV
  parentLanguage?: LanguageData;
  // parentLanguoid?: LanguageData; // Reserved after incorporating Glottolog data
  childLanguages: LanguageData[];
  // childLanguoids: LanguageData[];
};
