import { TerritoryCode, TerritoryData } from '../types/DataTypes';

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
