import React from 'react';

import { useDataContext } from '../../dataloading/DataContext';
import CommaSeparated from '../../generic/CommaSeparated';
import Hoverable from '../../generic/Hoverable';
import { CensusData } from '../../types/CensusTypes';
import { LanguageData } from '../../types/LanguageTypes';
import HoverableObjectName from '../common/HoverableObjectName';

type Props = {
  census: CensusData;
};

const CensusDetails: React.FC<Props> = ({ census }) => {
  return (
    <div className="Details">
      <CensusPrimarySection census={census} />
      <CensusPopulationCharacteristics census={census} />
      <CensusSourceSection census={census} />
      <CensusLanguagesSection census={census} />
    </div>
  );
};

function CensusPrimarySection({ census }: { census: CensusData }) {
  const { territory, isoRegionCode, domain, proficiency, acquisitionOrder, modality } = census;
  return (
    <div className="section">
      <div>
        <label>Territory:</label>
        {territory != null ? (
          <HoverableObjectName object={territory} />
        ) : (
          <span>{isoRegionCode}</span>
        )}
      </div>
      <div>
        <label>Year:</label> {census.yearCollected}
      </div>
      {modality != null && (
        <div>
          <label>Modality:</label> {modality}
        </div>
      )}
      {proficiency != null && (
        <div>
          <label>Proficiency:</label> {proficiency}
        </div>
      )}
      {acquisitionOrder != null && (
        <div>
          <label>Acquisition Order:</label> {acquisitionOrder}
        </div>
      )}
      {domain != null && (
        <div>
          <label>Where language used:</label> {domain}
        </div>
      )}
    </div>
  );
}

function CensusPopulationCharacteristics({ census }: { census: CensusData }) {
  const {
    languagesIncluded,
    eligiblePopulation,
    sampleRate,
    geographicScope,
    age,
    responsesPerIndividual,
    notes,
  } = census;

  return (
    <div className="section">
      <h3>Population Characteristics</h3>
      <div>
        <label>Eligible Population:</label> {eligiblePopulation.toLocaleString()}
      </div>
      {languagesIncluded != null && (
        <div>
          <label>Languages Included:</label> {languagesIncluded}
        </div>
      )}
      {sampleRate != null && (
        <div>
          <label>Surveyed Population:</label> {eligiblePopulation.toLocaleString()} (Sample Rate:{' '}
          {(sampleRate * 100).toLocaleString()}%)
        </div>
      )}
      {geographicScope != null && (
        <div>
          <label>Geographic Scope:</label> {geographicScope}
        </div>
      )}
      {age != null && (
        <div>
          <label>Age:</label> {age}
        </div>
      )}
      {responsesPerIndividual != null && (
        <div>
          <label>Responses per Individual:</label> {responsesPerIndividual}
        </div>
      )}
      {notes != null && (
        <div>
          <label>Notes:</label> {notes}
        </div>
      )}
    </div>
  );
}

function CensusSourceSection({ census }: { census: CensusData }) {
  const { url, citation, dateAccessed, datePublished, tableName, columnName } = census;

  return (
    <div className="section">
      <h3>Source</h3>
      {tableName && (
        <div>
          <label>Table Name:</label> {tableName}
        </div>
      )}
      {columnName && (
        <div>
          <label>Column Name:</label> {columnName}
        </div>
      )}
      {citation && (
        <div>
          <label>Citation:</label>
          {citation}
        </div>
      )}
      {url && (
        <div>
          <label>URL:</label>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </div>
      )}
      {datePublished && (
        <div>
          <label>Date Published:</label>
          {new Date(datePublished).toLocaleDateString()}
        </div>
      )}
      {dateAccessed && (
        <div>
          <label>Date Accessed:</label>
          {new Date(dateAccessed).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

function CensusLanguagesSection({ census }: { census: CensusData }) {
  const {
    languagesBySchema: { Inclusive: langs },
  } = useDataContext();
  const { eligiblePopulation } = census;

  return (
    <div className="section">
      <h3>Languages</h3>
      <div>
        <label>Language Count:</label> {census.languageCount}
      </div>
      {census.languageCount > 0 && (
        <div>
          <label>Languages:</label>
          <CommaSeparated>
            {Object.entries(census.languageEstimates)
              .sort(
                ([, a], [, b]) => b - a, // Sort by population estimate descending
              )
              .map(([langID, populationEstimate]) => (
                <HoverableLanguageEntry
                  eligiblePopulation={eligiblePopulation}
                  key={langID}
                  lang={langs[langID]}
                  langID={langID}
                  populationEstimate={populationEstimate}
                />
              ))}
          </CommaSeparated>
        </div>
      )}
    </div>
  );
}

function HoverableLanguageEntry({
  eligiblePopulation,
  lang,
  langID,
  populationEstimate,
}: {
  eligiblePopulation: number;
  lang?: LanguageData;
  langID: string;
  populationEstimate: number;
}) {
  const hoverContent = (
    <>
      <div>
        <label>Language Code:</label>
        {langID}
      </div>
      {lang != null && (
        <div>
          <label>Name:</label>
          {lang.nameDisplay}
        </div>
      )}
      {lang != null && (
        <div>
          <label>Scope:</label>
          {lang.scope}
        </div>
      )}
      <div>
        <label>Population:</label>
        {populationEstimate.toLocaleString()}
      </div>
      <div>
        <label>Percent:</label>
        {((populationEstimate * 100.0) / eligiblePopulation).toFixed(2)}%
      </div>
    </>
  );

  return <Hoverable hoverContent={hoverContent}>{lang?.nameDisplay ?? langID}</Hoverable>;
}

export default CensusDetails;
