import { TerritoryCode, TerritoryData } from '../types/DataTypes';
import { getObjectScopeLevel, ScopeLevel } from '../types/ScopeLevel';

import { CoreData } from './CoreData';
import { loadCLDRCoverage } from './UnicodeData';

const DEBUG = false;

/**
 * Get more data that is not necessary for the initial page load
 */
export async function loadSupplementalData(coreData: CoreData): Promise<void> {
  if (Object.values(coreData.locales).length == 0) {
    return; // won't load anything while data is empty
  }

  // TODO this appears to load multiple times -- but it should only load once.
  await Promise.all([loadCLDRCoverage(coreData), loadTerritoryGDPLiteracy(coreData.territories)]);

  // 001 is the UN code for the World
  computeContainedTerritoryStats(coreData.territories['001']);
}

async function loadTerritoryGDPLiteracy(
  territories: Record<TerritoryCode, TerritoryData>,
): Promise<void> {
  return await fetch('data/territories_gdp_literacy.tsv')
    .then((res) => res.text())
    .then((text) => {
      const SKIP_HEADER_ROWS = 5;
      const newTerritoriesData = text
        .split('\n')
        .slice(SKIP_HEADER_ROWS)
        .map((line) => {
          const parts = line.split('\t');
          return { code: parts[0], gdp: parseInt(parts[1]), literacyPercent: parseFloat(parts[2]) };
        });
      newTerritoriesData.forEach((newTerrData) => {
        const territory = territories[newTerrData.code];
        if (territory == null) {
          // Known exclusive: Antarctica (AQ) intentionally left out because its poorly defined linguistically
          if (DEBUG) console.log('Loading new territory data. Territory not found', newTerrData);
          return;
        }
        territory.literacyPercent = newTerrData.literacyPercent;
        territory.gdp = newTerrData.gdp;
      });
    })
    .catch((err) => console.error('Error loading TSV:', err));
}

function computeContainedTerritoryStats(terr: TerritoryData): void {
  // Make sure that territories within are computed
  const { containsTerritories } = terr;
  containsTerritories.forEach(computeContainedTerritoryStats);

  // Recompute the population for territory groups, in case it was updated from other data
  if (getObjectScopeLevel(terr) === ScopeLevel.Groups) {
    terr.population = containsTerritories.reduce((sum, t) => sum + (t.population ?? 0), 0);
  }

  // GDP is easy, just add it up
  terr.gdp ??= containsTerritories.reduce((sum, t) => sum + (t.gdp ?? 0), 0);

  // For literacy we will combine proportional to the population
  terr.literacyPercent ??=
    containsTerritories.reduce(
      (sum, t) => sum + (t.literacyPercent ?? 0) * (t.population ?? 0),
      0,
    ) / terr.population;
}
