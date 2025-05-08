import React from 'react';

import { usePageParams } from '../PageParamsContext';

type Props = {
  currentPage: number;
  totalPages: number;
};

const PaginationControls: React.FC<Props> = ({ currentPage, totalPages }) => {
  const { updatePageParams } = usePageParams();
  if (totalPages <= 1) {
    return <></>;
  }

  return (
    <>
      {' '}
      Page:{' '}
      <div className="selector compact">
        <button onClick={() => updatePageParams({ page: 1 })} disabled={currentPage === 1}>
          ⏮
        </button>
        <button
          onClick={() => updatePageParams({ page: Math.max(1, currentPage - 1) })}
          disabled={currentPage === 1}
        >
          ◀
        </button>

        <input
          className={currentPage === 1 ? 'empty' : ''}
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={(event) => updatePageParams({ page: parseInt(event.target.value) })}
          style={{ width: 50, textAlign: 'center' }}
        />

        <button
          onClick={() => updatePageParams({ page: Math.min(totalPages, currentPage + 1) })}
          disabled={currentPage >= totalPages}
        >
          ▶
        </button>
        <button
          onClick={() => updatePageParams({ page: totalPages })}
          disabled={currentPage === totalPages}
        >
          ⏭
        </button>
      </div>
    </>
  );
};

export default PaginationControls;
