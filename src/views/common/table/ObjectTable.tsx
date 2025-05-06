import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { getSubstringFilter } from '../../../controls/filter';
import { usePageParams } from '../../../controls/PageParamsContext';
import { SortBy } from '../../../controls/PageParamTypes';
import { getSortFunction } from '../../../controls/sort';
import { ObjectData } from '../../../DataTypes';
import HoverableButton from '../../../generic/HoverableButton';

import './tableStyles.css';

export interface TableColumn<T> {
  label: string;
  render: (object: T) => React.ReactNode;
  key?: string;
  isNumeric?: boolean;
  sortParam?: SortBy;
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
  const [sortDirectionIsNormal, setSortDirectionIsNormal] = useState(true);

  const objectsFilteredAndSorted = useMemo(() => {
    let result = objects.filter(substringFilterFunction ?? (() => true));
    if (sortDirectionIsNormal) {
      result = result.sort(sortFunction);
    } else {
      result = result.sort((a, b) => -sortFunction(a, b));
    }
    return result;
  }, [sortFunction, objects, substringFilterFunction, setSortDirectionIsNormal]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <table style={{ textAlign: 'start' }}>
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i} style={{ textAlign: 'start' }}>
                {column.label}
                <SortButton
                  columnSortBy={column.sortParam}
                  setSortDirectionIsNormal={setSortDirectionIsNormal}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {objectsFilteredAndSorted
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

type SortButtonProps = {
  columnSortBy?: SortBy;
  setSortDirectionIsNormal: Dispatch<SetStateAction<boolean>>;
};

const SortButton: React.FC<SortButtonProps> = ({ columnSortBy, setSortDirectionIsNormal }) => {
  const { sortBy, updatePageParams } = usePageParams();

  if (!columnSortBy) {
    return <></>;
  }

  function onSortButtonClick(newSortBy: SortBy): void {
    if (sortBy != newSortBy) {
      setSortDirectionIsNormal(true);
      updatePageParams({ sortBy: newSortBy });
    } else {
      setSortDirectionIsNormal((prev) => !prev);
    }
  }

  return (
    <HoverableButton
      className={sortBy === columnSortBy ? 'sort active' : 'sort'}
      hoverContent="Click to sort by this column or to toggle the sort direction."
      onClick={() => onSortButtonClick(columnSortBy)}
    >
      ⇅
    </HoverableButton>
  );
};

export default ObjectTable;
