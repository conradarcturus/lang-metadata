import React from 'react';

type Props = {
  title?: React.ReactNode;
  children: React.ReactNode;
};

const ViewDetails: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="Details">
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
};

export default ViewDetails;
