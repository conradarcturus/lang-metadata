import { BCP47LocaleCode, LocaleData, TerritoryType } from '../types/DataTypes';

export function computeWritingPopulationForLocales(
  locales: Record<BCP47LocaleCode, LocaleData>,
): void {
  Object.values(locales)
    .filter(
      (l) =>
        l.territory?.territoryType === TerritoryType.Country ||
        l.territory?.territoryType === TerritoryType.Dependency,
    )
    .forEach((locale) => {
      const literacyPercent = locale.territory?.literacyPercent ?? 100;

      locale.populationWriting = Math.round((locale.populationSpeaking * literacyPercent) / 100);
      if (locale.populationSpeakingPercent != null) {
        locale.populationWritingPercent =
          (locale.populationSpeakingPercent * literacyPercent) / 100;
      }
    });
}
