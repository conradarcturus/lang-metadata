import { BCP47LocaleCode, LocaleData, TerritoryType } from '../types/DataTypes';

function estimatePopulationFromHistoric(
  langPop: number,
  historicTotal: number,
  latestCountryPop: number
): { estimated: number; capped: boolean; warning?: string } {
  const ratio = langPop / historicTotal;
  const estimated = Math.round(ratio * latestCountryPop);

  if (estimated > latestCountryPop) {
    return {
      estimated: latestCountryPop,
      capped: true,
      warning: `Estimated population for language exceeds 100% of ${latestCountryPop.toLocaleString()}. Value capped.`,
    };
  }

  return {
    estimated,
    capped: false,
  };
}

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

      // 🌍 Estimate 2025 projected population from historical %
      if (
        locale.populationSpeaking != null &&
        locale.territory?.historicPopulation != null &&
        locale.territory?.latestPopulation != null
      ) {
        const projected = estimatePopulationFromHistoric(
          locale.populationSpeaking,
          locale.territory.historicPopulation,
          locale.territory.latestPopulation,
        );

        locale.projectedPopulation2025 = projected.estimated;

        if (projected.capped) {
          if (!locale.warnings) locale.warnings = [];
          locale.warnings.push({
            type: 'POPULATION_EXCEEDS_TOTAL',
            message: projected.warning,
          });
        }
      }

      locale.populationWriting = Math.round((locale.populationSpeaking * literacyPercent) / 100);
      if (locale.populationSpeakingPercent != null) {
        locale.populationWritingPercent =
          (locale.populationSpeakingPercent * literacyPercent) / 100;
      }
    });
}
