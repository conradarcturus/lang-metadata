import React from 'react';

import { usePageParams } from '../controls/PageParamsContext';
import { Dimension, LanguageSchema } from '../controls/PageParamTypes';

interface Props {
  nShown: number;
  nFiltered: number;
  nOverall: number;
}

const VisibleItemsMeter: React.FC<Props> = ({ nShown, nFiltered, nOverall }) => {
  if (nOverall === 0) {
    return 'Data is still loading. If you are waiting awhile there could be an error in the data.';
  }
  const totalItemsLoaded = (
    <>
      {nOverall > nFiltered && <> There are {<strong>{nOverall}</strong>} total</>}{' '}
      {getObjectTypeLabel()}
    </>
  );

  if (nFiltered === 0) {
    return <>No results found with current filters.{totalItemsLoaded}</>;
  }

  if (nFiltered === nOverall) {
    // Easy case, no filter changing results
    return (
      <>
        Showing <strong>{nShown}</strong>
        {nOverall > nShown && <> of {<strong>{nOverall}</strong>}</>} {getObjectTypeLabel()}.
      </>
    );
  }

  return (
    <>
      Showing <strong>{nShown}</strong>
      {nFiltered > nShown && <> of {<strong>{nFiltered}</strong>}</>} filtered{' '}
      {getObjectTypeLabel()}.{nOverall > nFiltered && totalItemsLoaded}
    </>
  );
};

function getObjectTypeLabel(): string {
  const { languageSchema, dimension } = usePageParams();

  switch (dimension) {
    case Dimension.Language:
      switch (languageSchema) {
        case LanguageSchema.Glottolog:
          return 'glottolog languages';
        case LanguageSchema.Inclusive:
          return 'languoids';
        case LanguageSchema.ISO:
          return 'ISO languages';
        case LanguageSchema.WAL:
          return 'languages';
      }
    // eslint-disable-next-line no-fallthrough
    case Dimension.Locale:
      return 'locales';
    case Dimension.Territory:
      return 'countries and dependencies';
    case Dimension.WritingSystem:
      return 'writing systems';
  }
}

export default VisibleItemsMeter;
