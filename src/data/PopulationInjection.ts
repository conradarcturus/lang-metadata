// src/data/PopulationInjection.ts

import { LocaleData } from '../types/DataTypes';

interface PopulationMap {
  [territoryCode: string]: {
    historic: number;
    latest: number;
  };
}

export function parseTerritoryPopulationTSV(tsvContent: string): PopulationMap {
  const lines = tsvContent.trim().split('\n');
  lines.shift(); // remove header
  const map: PopulationMap = {};

  for (const line of lines) {
    const [code, _name, pop1999, popLatest] = line.split('\t');
    if (!code || isNaN(+pop1999) || isNaN(+popLatest)) continue;

    map[code.trim()] = {
      historic: +pop1999,
      latest: +popLatest,
    };
  }

  return map;
}

export function injectPopulationIntoLocales(
  locales: Record<string, LocaleData>,
  popMap: PopulationMap
): void {
  for (const locale of Object.values(locales)) {
    const terrCode = locale.territory?.code;
    if (!terrCode || !popMap[terrCode]) continue;

    if (!locale.territory) continue;

    locale.territory.historicPopulation = popMap[terrCode].historic;
    locale.territory.latestPopulation = popMap[terrCode].latest;
  }
}
