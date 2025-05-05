import React, { useMemo } from 'react';

import { getViableRootEntriesFilter } from '../../controls/filter';
import { useDataContext } from '../../dataloading/DataContext';
import { WritingSystemData } from '../../DataTypes';
import { CodeColumn, InfoButtonColumn, NameColumn } from '../common/table/CommonColumns';
import ObjectTable from '../common/table/ObjectTable';

const WritingSystemTable: React.FC = () => {
  const { writingSystems } = useDataContext();
  const viableEntriesFunction = getViableRootEntriesFilter();

  const objects: WritingSystemData[] = useMemo(() => {
    return Object.values(writingSystems).filter(viableEntriesFunction);
  }, [viableEntriesFunction]);

  return (
    <ObjectTable<WritingSystemData>
      objects={objects}
      columns={[
        CodeColumn,
        NameColumn,
        {
          label: 'Population',
          render: (object) => object.populationUpperBound,
          isNumeric: true,
        },
        InfoButtonColumn,
      ]}
    />
  );
};

export default WritingSystemTable;
