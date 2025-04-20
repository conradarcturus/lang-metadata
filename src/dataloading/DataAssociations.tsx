import { LanguageCode, LanguageData } from './DataTypes';

export function connectLanguagesToParent(
  languagesByCode: Record<LanguageCode, LanguageData>,
): void {
  Object.values(languagesByCode).forEach((lang) => {
    // Connect regular language code, eg. cmn -> zho
    if (lang.parentLanguageCode != '') {
      const parent = languagesByCode[lang.parentLanguageCode];
      if (parent != null) {
        parent.childLanguages.push(lang);
        lang.parentLanguage = parent;
      }
    }
  });
}
