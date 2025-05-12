import React from 'react';

import Hoverable from '../../generic/Hoverable';

type Props = {
  children: React.ReactNode;
  selectorLabel?: string;
  selectorDescription?: React.ReactNode;
};

const Selector: React.FC<Props> = ({ children, selectorLabel, selectorDescription }) => {
  return (
    <div className="selector">
      {selectorLabel != null && (
        <label>
          <Hoverable hoverContent={selectorDescription} style={{ textDecoration: 'none' }}>
            {selectorLabel}
          </Hoverable>
        </label>
      )}
      {children}
    </div>
  );
};

export default Selector;
