import React from 'react';

import { useHoverCard } from './HoverCardContext';

type HoverableProps = {
  children: React.ReactNode;
  hoverContent: React.ReactNode;
  onClick?: () => void;
};

const Hoverable: React.FC<HoverableProps> = ({ children, hoverContent, onClick }) => {
  const { showHoverCard, hideHoverCard } = useHoverCard();

  const handleMouseEnter = (e: React.MouseEvent) => {
    showHoverCard(hoverContent, e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    showHoverCard(hoverContent, e.clientX, e.clientY);
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={hideHoverCard}
      onClick={() => {
        hideHoverCard();
        if (onClick != null) {
          onClick();
        }
      }}
      style={{
        display: 'inline-block',
        textDecoration: 'underline',
        cursor: onClick ? 'pointer' : 'auto',
      }}
    >
      {children}
    </span>
  );
};

export default Hoverable;
