import React from 'react';

interface Props {
  nShown: number;
  nFiltered: number;
  nOverall: number;
  nounPlural: string;
}

const VisibleItemsMeter: React.FC<Props> = ({ nShown, nFiltered, nOverall, nounPlural }) => {
  if (nOverall === 0) {
    return 'Data is still loading. If you are waiting awhile there could be an error in the data.';
  }
  const totalItemsLoaded = (
    <>
      {nOverall > nFiltered && <> There are {<strong>{nOverall}</strong>} total</>} {nounPlural}
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
        {nOverall > nShown && <> of {<strong>{nOverall}</strong>}</>} {nounPlural}.
      </>
    );
  }

  return (
    <>
      Showing <strong>{nShown}</strong>
      {nFiltered > nShown && <> of {<strong>{nFiltered}</strong>}</>} filtered {nounPlural}.
      {nOverall > nFiltered && totalItemsLoaded}
    </>
  );
};

export default VisibleItemsMeter;
