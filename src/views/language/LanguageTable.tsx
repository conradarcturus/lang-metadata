import React, { useMemo } from 'react';

import { getViableRootEntriesFilter } from '../../controls/filter';
import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import { LanguageData } from '../../DataTypes';
import { CodeColumn, InfoButtonColumn, NameColumn } from '../common/table/CommonColumns';
import ObjectTable from '../common/table/ObjectTable';

const LanguageTable: React.FC = () => {
  const { languagesBySchema } = useDataContext();
  const { languageSchema } = usePageParams();
  const viableEntriesFunction = getViableRootEntriesFilter();
  const languages = useMemo(
    () => Object.values(languagesBySchema[languageSchema]).filter(viableEntriesFunction),
    [languageSchema, viableEntriesFunction],
  );

  return (
    <ObjectTable<LanguageData>
      objects={languages}
      columns={[
        CodeColumn,
        NameColumn,
        {
          label: 'Scope',
          render: (lang) => lang.schemaSpecific[languageSchema].scope ?? lang.scope,
        },
        {
          label: 'Population',
          render: (lang) => lang.populationCited,
          isNumeric: true,
        },
        InfoButtonColumn,
      ]}
    />
  );
};

export default LanguageTable;
