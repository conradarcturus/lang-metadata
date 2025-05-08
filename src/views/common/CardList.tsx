import React from 'react';

import { getScopeFilter, getSliceFunction, getSubstringFilter } from '../../controls/filter';
import { getSortFunction } from '../../controls/sort';
import { ObjectData } from '../../types/DataTypes';
import ViewCard from '../ViewCard';
import VisibleItemsMeter from '../VisibleItemsMeter';

interface Props<T> {
  objects: T[];
  renderCard: (object: T) => React.ReactNode;
}

function CardList<T extends ObjectData>({ objects, renderCard }: Props<T>) {
  const sortBy = getSortFunction();
  const filterBySubstring = getSubstringFilter() || (() => true);
  const filterByScope = getScopeFilter();
  const sliceFunction = getSliceFunction<T>();

  // Filter results
  const objectsFiltered = objects.filter(filterByScope).filter(filterBySubstring);
  // Sort results & limit how many are visible
  const objectsVisible = sliceFunction(objectsFiltered.sort(sortBy));

  return (
    <div>
      <div className="CardListDescription">
        <VisibleItemsMeter
          nShown={objectsVisible.length}
          nFiltered={objectsFiltered.length}
          nOverall={objects.length}
        />
      </div>
      <div className="CardList">
        {objectsVisible.map((object) => (
          <ViewCard key={object.code}>{renderCard(object)}</ViewCard>
        ))}
      </div>
    </div>
  );
}

export default CardList;
