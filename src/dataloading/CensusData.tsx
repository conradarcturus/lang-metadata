import { CensusData } from '../types/CensusTypes';
import { LanguageCode } from '../types/LanguageTypes';
import { ObjectType } from '../types/PageParamTypes';

import { CoreData } from './CoreData';

export async function loadCensusData(): Promise<CensusImport | void> {
  const filename = 'ca2021';
  return await fetch(`data/census/${filename}.tsv`)
    .then((res) => res.text())
    .then((fileInput) => parseCensusImport(fileInput, filename))
    .catch((err) => console.error('Error loading TSV:', err));
}

type CensusImport = {
  // Metadata about the data collection
  censuses: CensusData[];

  // Imported to add additional language names to the language data
  languageNames: Record<LanguageCode, string>;
};

function parseCensusImport(fileInput: string, filename: string): CensusImport {
  const lines = fileInput.split('\n');

  // Create an array based on the number of census columns
  // (number of censusNames, which is columns after the first two)
  // This will be used to initialize metadatas and other arrays
  const censusCount = lines[0].split('\t').length - 2; // -2 because the first 2 columns are the language code and language name
  if (censusCount <= 0) {
    throw new Error('No census data found in the file.');
  }
  const censuses: CensusData[] = Array.from({ length: censusCount }, (_, index) => ({
    type: ObjectType.Census,
    ID: filename + '.' + (index + 1),
    codeDisplay: filename + '.' + (index + 1),

    // This will be set later -- its just initialized here because they are strictly required
    nameDisplay: '',
    names: [],
    isoRegionCode: '',
    languageCount: 0,
    yearCollected: 0,
    eligiblePopulation: 0,
    languageEstimates: {},
  }));

  // Iterate through the rest of the lines to collect metadata until we hit the break line
  let lineNumber = 0;
  for (lineNumber = 0; lineNumber < lines.length; lineNumber++) {
    const line = lines[lineNumber].trim();

    // If the line starts with a '#', it's metadata about the census
    if (line.startsWith('#')) {
      const parts = line.split('\t').map((part) => part.trim());
      const key = parts[0].slice(1) as keyof CensusData;
      const values = parts.slice(2); // Column 2 is reserved empty, so we skip it
      values.forEach((value, index) => {
        if (key === 'datePublished' || key === 'dateAccessed') {
          censuses[index][key] = new Date(value);
        } else if (key === 'eligiblePopulation' || key == 'yearCollected') {
          censuses[index][key] = Number.parseInt(value.replace(/,/g, ''));
        } else if (key === 'sampleRate') {
          censuses[index][key] = Number.parseFloat(value);
        } else if (
          key == 'languageCount' ||
          key == 'languageEstimates' ||
          key == 'type' ||
          key == 'territory' ||
          key == 'names'
        ) {
          // these keys should not be passed in here
        } else if (value !== '') {
          // Regular strings, but only save if something is filled in
          censuses[index][key] = value;
        }
      });
    } else {
      // If the line does not start with a '#', it is part of the main data section
      // so end this loop and start processing the main data section
      break;
    }
  }

  // Set other fields required for objects and report an error if an important one is missing
  censuses.forEach((census) => {
    // Construct a unique ID for each census
    census.names = [census.nameDisplay, census.tableName, census.columnName].filter(
      (n) => n != null,
    );
    if (census.isoRegionCode === '') {
      console.error('Census data is missing isoRegionCode:', census);
    }
    if (census.yearCollected === 0) {
      console.error('Census data is missing yearCollected:', census);
    }
    if (census.eligiblePopulation === 0) {
      console.error('Census data is missing eligiblePopulation:', census);
    }
    if (census.nameDisplay === '') {
      console.error('Census data is missing nameDisplay:', census);
    }
  });

  // Process the remaining lines as language data
  const languageNames: Record<LanguageCode, string> = {};
  for (const line of lines.splice(lineNumber)) {
    const parts = line.split('\t');
    if (parts.length < 3) {
      continue; // Skip lines that do not have enough data
    }

    const languageCode = parts[0].trim() as LanguageCode;
    if (['Language Code', 'mul', 'mis', 'und', 'zxx'].includes(languageCode)) {
      // Skip header and special language codes
      // 'Language Code' is the header, 'mul' is for multiple languages, 'mis' is for missing languages,
      // 'und' is for undefined languages, and 'zxx' is for no linguistic content
      continue;
    }

    languageNames[languageCode] = parts[1].trim(); // The language name is in the second column

    // Add population estimates to censuses when its non-empty
    parts.slice(2).forEach((part, i) => {
      if (part.trim() === '') {
        return; // Skip empty parts
      }
      // const populationEstimate = Number.parseInt(part.replace(/,/g, ''));
      if (i >= censuses.length) {
        // There are more records for this language than there are census declarations
        console.warn(`Skipping extra population estimate for ${languageCode} in line: ${line}`);
        return;
      }
      censuses[i].languageEstimates[languageCode] = Number.parseInt(part.replace(/,/g, ''));
      censuses[i].languageCount += 1; // Increment the language count for the first census
    });
  }

  return {
    censuses,
    languageNames,
  };
}

export function addCensusData(coreData: CoreData, censusData: CensusImport): void {
  // Add the census records to the core data
  for (const census of censusData.censuses) {
    // Add the census to the core data if its not there yet
    if (coreData.censuses[census.ID] == null) {
      coreData.censuses[census.ID] = census;

      // Add the territory reference to it
      const territory = coreData.territories[census.isoRegionCode];
      if (territory != null) {
        census.territory = territory;
        territory.censuses.push(census);
      }
    } else {
      // It's reloaded twice on dev mode
      // console.warn(`Census data for ${census.ID} already exists, skipping.`);
    }
  }
}
