import React, { useMemo } from 'react';

import { getViableRootEntriesFilter } from '../../controls/filter';
import { useDataContext } from '../../dataloading/DataContext';
import { LocaleData } from '../../DataTypes';
import { CodeColumn, InfoButtonColumn, NameColumn } from '../common/table/CommonColumns';
import ObjectTable from '../common/table/ObjectTable';

const LocaleTable: React.FC = () => {
  const { locales } = useDataContext();
  const viableEntriesFunction = getViableRootEntriesFilter();

  const objects: LocaleData[] = useMemo(() => {
    return Object.values(locales).filter(viableEntriesFunction);
  }, [viableEntriesFunction]);

  return (
    <ObjectTable<LocaleData>
      objects={objects}
      columns={[
        CodeColumn,
        NameColumn,
        {
          label: 'Population',
          render: (object) => object.populationEstimate,
          isNumeric: true,
        },
        InfoButtonColumn,
      ]}
    />
  );
};

export default LocaleTable;
