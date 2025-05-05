import React from 'react';

import './tableStyles.css';
import { getSubstringFilter } from '../../../controls/filter';
import { usePageParams } from '../../../controls/PageParamsContext';
import { getSortFunction } from '../../../controls/sort';
import { ObjectData } from '../../../DataTypes';

export interface TableColumn<T> {
  label: string;
  render: (object: T) => React.ReactNode;
  key?: string;
  isNumeric?: boolean;
}

export const TABLE_MAX_ROWS = 200;

interface Props<T> {
  objects: T[];
  columns: TableColumn<T>[];
}

/**
 * A page that shows tips about problems in the data that may need to be addressed
 */
function ObjectTable<T extends ObjectData>({ objects, columns }: Props<T>) {
  const { limit } = usePageParams();
  const sortFunction = getSortFunction();
  const substringFilterFunction = getSubstringFilter();

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <table style={{ textAlign: 'start' }}>
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i} style={{ textAlign: 'start' }}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {objects
            .filter(substringFilterFunction ?? (() => true))
            .sort(sortFunction)
            .slice(0, limit > 0 ? limit : TABLE_MAX_ROWS)
            .map((object, i) => (
              <tr key={i}>
                {columns.map((column, i) => {
                  let content = column.render(object);
                  if (typeof content === 'number') {
                    content = content.toLocaleString();
                  }

                  return (
                    <td key={i} className={column.isNumeric ? 'numeric' : undefined}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ObjectTable;
