import React from 'react';

import { useDataContext } from '../../dataloading/DataContext';
import { TerritoryData } from '../../types/DataTypes';
import { SortBy } from '../../types/PageParamTypes';
import { CodeColumn, InfoButtonColumn, NameColumn } from '../common/table/CommonColumns';
import ObjectTable from '../common/table/ObjectTable';

const TerritoryTable: React.FC = () => {
  const { territoriesByCode } = useDataContext();

  return (
    <ObjectTable<TerritoryData>
      objects={Object.values(territoriesByCode)}
      columns={[
        CodeColumn,
        NameColumn,
        {
          label: 'Population',
          render: (object) => object.population,
          isNumeric: true,
          sortParam: SortBy.Population,
        },
        {
          label: 'Type',
          render: (object) => object.territoryType,
        },
        InfoButtonColumn,
      ]}
    />
  );
};

export default TerritoryTable;
