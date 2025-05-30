import { CensusData } from '../types/CensusTypes';
import { LanguageCode } from '../types/LanguageTypes';

import { CoreData } from './CoreData';

export async function loadCensusData(): Promise<CensusImport | void> {
  return await fetch('data/census/canada-2021.tsv')
    .then((res) => res.text())
    .then(parseCollectionImport)
    .catch((err) => console.error('Error loading TSV:', err));
}

type CensusImport = {
  // Metadata about the data collection
  censusMetadatas: CensusData[];

  // The main data we want -- different population estimates for different languages
  languagePopulationEstimates: Record<LanguageCode, number[]>;

  // Imported to add additional language names to the language data
  languageNames: Record<LanguageCode, string>;
};

function parseCollectionImport(fileInput: string): CensusImport {
  const lines = fileInput.split('\n');

  // The first line should contain census keys
  if (!lines[0].startsWith('CensusKey')) {
    throw new Error('Invalid census data format: first line must contain CensusKey');
  }
  const collectionKeys = lines.splice(0, 1)[0].split('\t').slice(2); // the first column is the field name, second column is reserved empty, the rest are the keys for censuses

  // Iterate through the rest of the lines to collect metadata until we hit the break line
  const metadatas: Partial<CensusData>[] = collectionKeys.map((ID) => ({
    ID,
  }));

  for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
    const line = lines[lineNumber].trim();

    // If the line starts with a '#', it's metadata about the census
    if (line.startsWith('#')) {
      const parts = line.split('\t').map((part) => part.trim());
      const key = parts[0].slice(1) as keyof CensusData;
      const values = parts.slice(2); // Column 2 is reserved empty, so we skip it
      values.forEach((value, index) => {
        if (key === 'datePublished' || key === 'dateCollected') {
          metadatas[index][key] = new Date(value);
        } else if (key === 'denominator') {
          metadatas[index][key] = Number.parseInt(value.replace(/,/g, ''));
        } else if (key === 'sampleRate' || key === 'responsesPerIndividual') {
          metadatas[index][key] = Number.parseFloat(value);
        } else if (
          key == 'languageCount' ||
          key == 'scope' ||
          key == 'type' ||
          key == 'territory' ||
          key == 'nameEndonym' ||
          key == 'codeDisplay' ||
          key == 'ID' ||
          key == 'nameDisplay' ||
          key == 'names'
        ) {
          // these keys should not be passed in here
        } else {
          metadatas[index][key] = value;
        }
      });
    } else {
      // If the line does not start with a '#', it is part of the main data section
      // so end this loop and start processing the main data section
      break;
    }
  }

  const languagePopulationEstimates: Record<LanguageCode, number[]> = {};
  const languageNames: Record<LanguageCode, string> = {};
  // TODO

  return {
    censusMetadatas: metadatas as CensusData[],
    languagePopulationEstimates,
    languageNames,
  };
}

export function addCensusData(coreData: CoreData, censusData: CensusImport): void {
  // Add the census records to the core data
  for (const collection of censusData.censusMetadatas) {
    if (coreData.censuses[collection.ID] == null) {
      coreData.censuses[collection.ID] = collection;
    } else {
      console.warn(`Census data for ${collection.ID} already exists, skipping.`);
    }
  }
}
