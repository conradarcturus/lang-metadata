import React from 'react';

import { SortBy } from '../../controls/PageParamTypes';
import { useDataContext } from '../../dataloading/DataContext';
import { WritingSystemData } from '../../DataTypes';
import { CodeColumn, InfoButtonColumn, NameColumn } from '../common/table/CommonColumns';
import ObjectTable from '../common/table/ObjectTable';

const WritingSystemTable: React.FC = () => {
  const { writingSystems } = useDataContext();

  return (
    <ObjectTable<WritingSystemData>
      objects={Object.values(writingSystems)}
      columns={[
        CodeColumn,
        NameColumn,
        {
          label: 'Population',
          render: (object) => object.populationUpperBound,
          isNumeric: true,
          sortParam: SortBy.Population,
        },
        InfoButtonColumn,
      ]}
    />
  );
};

export default WritingSystemTable;
