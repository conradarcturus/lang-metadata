import React, { useMemo } from 'react';

import { getViableRootEntriesFilter } from '../../controls/filter';
import { useDataContext } from '../../dataloading/DataContext';
import { TerritoryData } from '../../DataTypes';
import { CodeColumn, InfoButtonColumn, NameColumn } from '../common/table/CommonColumns';
import ObjectTable from '../common/table/ObjectTable';

const TerritoryTable: React.FC = () => {
  const { territoriesByCode } = useDataContext();
  const viableEntriesFunction = getViableRootEntriesFilter();

  const objects: TerritoryData[] = useMemo(() => {
    return Object.values(territoriesByCode).filter(viableEntriesFunction);
  }, [viableEntriesFunction]);

  return (
    <ObjectTable<TerritoryData>
      objects={objects}
      columns={[
        CodeColumn,
        NameColumn,
        {
          label: 'Population',
          render: (object) => object.population,
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
