import React from 'react';

import { useDataContext } from '../../data/DataContext';
import { LocaleData } from '../../types/DataTypes';
import { SortBy } from '../../types/PageParamTypes';
import { CodeColumn, InfoButtonColumn, NameColumn } from '../common/table/CommonColumns';
import ObjectTable from '../common/table/ObjectTable';

const LocaleTable: React.FC = () => {
  const { locales } = useDataContext();

  return (
    <ObjectTable<LocaleData>
      objects={Object.values(locales)}
      columns={[
        CodeColumn,
        NameColumn,
        {
          label: 'Population',
          render: (object) => object.populationEstimate,
          isNumeric: true,
          sortParam: SortBy.Population,
        },
        InfoButtonColumn,
      ]}
    />
  );
};

export default LocaleTable;
