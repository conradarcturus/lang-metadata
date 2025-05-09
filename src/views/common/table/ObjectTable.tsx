import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { getScopeFilter, getSliceFunction, getSubstringFilter } from '../../../controls/filter';
import { usePageParams } from '../../../controls/PageParamsContext';
import { getSortFunction } from '../../../controls/sort';
import HoverableButton from '../../../generic/HoverableButton';
import { ObjectData } from '../../../types/DataTypes';
import { SortBy } from '../../../types/PageParamTypes';
import VisibleItemsMeter from '../../VisibleItemsMeter';

import './tableStyles.css';

export interface TableColumn<T> {
  label: string;
  render: (object: T) => React.ReactNode;
  key?: string;
  isNumeric?: boolean;
  sortParam?: SortBy;
}

interface Props<T> {
  objects: T[];
  columns: TableColumn<T>[];
}

/**
 * A page that shows tips about problems in the data that may need to be addressed
 */
function ObjectTable<T extends ObjectData>({ objects, columns }: Props<T>) {
  const { limit } = usePageParams();
  const sortBy = getSortFunction();
  const substringFilter = getSubstringFilter();
  const scopeFilter = getScopeFilter();
  const [sortDirectionIsNormal, setSortDirectionIsNormal] = useState(true);
  const sliceFunction = getSliceFunction<T>();

  const objectsFilteredAndSorted = useMemo(() => {
    let result = objects.filter(substringFilter ?? (() => true)).filter(scopeFilter);
    if (sortDirectionIsNormal) {
      result = result.sort(sortBy);
    } else {
      result = result.sort((a, b) => -sortBy(a, b));
    }
    return result;
  }, [sortBy, objects, substringFilter, scopeFilter, sortDirectionIsNormal]);
  const nRowsAfterFilter = useMemo(
    () => objectsFilteredAndSorted.length,
    [objectsFilteredAndSorted],
  );

  return (
    <div className="ObjectTableContainer">
      <VisibleItemsMeter
        nShown={nRowsAfterFilter < limit || limit < 1 ? nRowsAfterFilter : limit}
        nFiltered={nRowsAfterFilter}
        nOverall={objects.length}
      />
      <table className="ObjectTable">
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
          {sliceFunction(objectsFilteredAndSorted).map((object, i) => (
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
