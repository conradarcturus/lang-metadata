import React from 'react';

import { useDataContext } from '../../dataloading/DataContext';
import { TerritoryData } from '../../types/DataTypes';
import { SortBy } from '../../types/PageParamTypes';
import { CodeColumn, InfoButtonColumn, NameColumn } from '../common/table/CommonColumns';
import ObjectTable from '../common/table/ObjectTable';

const TerritoryTable: React.FC = () => {
  const { territories } = useDataContext();

  return (
    <ObjectTable<TerritoryData>
      objects={Object.values(territories)}
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
          label: 'Literacy',
          render: (object) =>
            object.literacyPercent != null ? object.literacyPercent.toFixed(1) + '%' : null,
          isNumeric: true,
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
