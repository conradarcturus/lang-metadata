import React from 'react';

import { usePageParams } from '../controls/PageParamsContext';
import PaginationControls from '../controls/selectors/PaginationControls';
import { LanguageSchema } from '../types/LanguageTypes';
import { Dimension } from '../types/PageParamTypes';

import { getDimensionLabelPlural } from './common/getObjectName';

interface Props {
  nShown: number;
  nFiltered: number;
  nOverall: number;
}

const VisibleItemsMeter: React.FC<Props> = ({ nShown, nFiltered, nOverall }) => {
  const { page, limit } = usePageParams();

  if (nOverall === 0) {
    return 'Data is still loading. If you are waiting awhile there could be an error in the data.';
  }
  const totalItemsLoaded = (
    <>
      {nOverall > nFiltered && <> There are {<strong>{nOverall}</strong>} total</>}{' '}
      <ObjectTypeLabel />.
    </>
  );

  if (nFiltered === 0) {
    return (
      <div style={{ display: 'inline-block' }}>
        No results found with current filters.{totalItemsLoaded}
      </div>
    );
  }

  if (nFiltered === nOverall) {
    // Easy case, no filter changing results
    return (
      <div style={{ display: 'inline-block' }}>
        Showing <strong>{nShown}</strong>
        {nOverall > nShown && <> of {<strong>{nOverall}</strong>}</>} <ObjectTypeLabel />.
        <PaginationControls
          currentPage={page}
          totalPages={limit < 1 ? 1 : Math.ceil(nFiltered / limit)}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'inline-block' }}>
      Showing <strong>{nShown}</strong>
      {nFiltered > nShown && <> of {<strong>{nFiltered}</strong>}</>} filtered <ObjectTypeLabel />.
      {nOverall > nFiltered && totalItemsLoaded}
      <PaginationControls
        currentPage={page}
        totalPages={limit < 1 ? 1 : Math.ceil(nFiltered / limit)}
      />
    </div>
  );
};

const ObjectTypeLabel: React.FC = () => {
  const { languageSchema, dimension } = usePageParams();

  if (dimension === Dimension.Language) {
    switch (languageSchema) {
      case LanguageSchema.Glottolog:
        return 'glottolog languages';
      case LanguageSchema.Inclusive:
        return 'languages and language-like entities';
      case LanguageSchema.ISO:
        return 'ISO languages';
      case LanguageSchema.WAL:
      case LanguageSchema.CLDR:
        break; // fall back to the regular plural (languages)
    }
  }
  return getDimensionLabelPlural(dimension);
};

export default VisibleItemsMeter;
