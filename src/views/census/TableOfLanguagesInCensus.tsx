import React from 'react';

import { useDataContext } from '../../dataloading/DataContext';
import { CensusData } from '../../types/CensusTypes';
import { LocaleData } from '../../types/DataTypes';
import { ObjectType, SortBy } from '../../types/PageParamTypes';
import { getLanguageScopeLevel, ScopeLevel } from '../../types/ScopeLevel';
import { CodeColumn, NameColumn } from '../common/table/CommonColumns';
import ObjectTable from '../common/table/ObjectTable';

type Props = {
  census: CensusData;
};

const TableOfLanguagesInCensus: React.FC<Props> = ({ census }) => {
  const {
    languagesBySchema: { Inclusive: langObjects },
  } = useDataContext();

  const langsNotFound: string[] = [];

  // Create new locale data objects based on the census results
  const languagesInCensus: LocaleData[] = Object.entries(census.languageEstimates)
    .map(([langID, populationEstimate]) => {
      const lang = langObjects[langID];
      if (lang == null) {
        langsNotFound.push(langID);
        return null;
      }
      return {
        type: ObjectType.Locale,
        ID: langID + census.ID,
        codeDisplay: lang.codeDisplay,
        languageCode: langID,
        language: lang,
        nameDisplay: lang.nameDisplay,
        names: lang.names,
        scope: lang.scope != null ? getLanguageScopeLevel(lang) : ScopeLevel.Other,

        territory: census.territory,
        territoryCode: census.isoRegionCode,

        populationSource: census.nameDisplay,
        populationEstimate,
        populationPercentOfTerritory: (populationEstimate * 100) / census.eligiblePopulation,
      } as LocaleData;
    })
    .filter((loc) => loc != null);

  return (
    <div>
      {langsNotFound.length > 0 && (
        <div>
          <label>Languages not found in the database:</label>
          {langsNotFound.join(', ')}
        </div>
      )}
      <ObjectTable<LocaleData>
        objects={languagesInCensus}
        columns={[
          CodeColumn,
          NameColumn,
          {
            label: 'Population',
            render: (loc) => loc.populationEstimate,
            isNumeric: true,
            sortParam: SortBy.Population,
          },
          {
            label: 'Percent within Territory',
            render: (loc) =>
              loc.populationPercentOfTerritory != null
                ? loc.populationPercentOfTerritory.toFixed(2) + '%'
                : 'N/A',
            isNumeric: true,
          },
          {
            label: 'Scope',
            render: (loc) => loc.language?.scope,
            isNumeric: false,
          },
        ]}
      />
    </div>
  );
};

export default TableOfLanguagesInCensus;
