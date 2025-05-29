import React, { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';
import './styles.css';

type HoverCardData = {
  content: React.ReactNode;
  x: number;
  y: number;
  visible: boolean;
};

type HoverCardContextType = {
  showHoverCard: (content: React.ReactNode, x: number, y: number) => void;
  hideHoverCard: () => void;
  hoverCard: HoverCardData;
};

const HoverCardContext = createContext<HoverCardContextType | undefined>(undefined);

export const HoverCardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hoverCard, setHoverCard] = useState<HoverCardData>({
    content: null,
    x: 0,
    y: 0,
    visible: false,
  });

  const showHoverCard = (content: React.ReactNode, x: number, y: number) => {
    setHoverCard({ content, x, y, visible: true });
  };

  const hideHoverCard = () => {
    setHoverCard((prev) => ({ ...prev, visible: false }));
  };

  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!cardRef.current || !hoverCard.visible) return;

    const card = cardRef.current;

    const { offsetWidth, offsetHeight } = card;

    let newX = hoverCard.x + 10;
    let newY = hoverCard.y + 10;

    if (newX + offsetWidth > window.innerWidth) {
      newX = window.innerWidth - offsetWidth - 10;
    }

    if (newY + offsetHeight > window.innerHeight) {
      newY = window.innerHeight - offsetHeight - 10;
    }

    if (newX !== hoverCard.x || newY !== hoverCard.y) {
      setHoverCard((prev) => ({ ...prev, x: newX - 10, y: newY - 10 }));
    }
  }, [hoverCard.x, hoverCard.y, hoverCard.visible]);

  return (
    <HoverCardContext.Provider value={{ hoverCard, showHoverCard, hideHoverCard }}>
      {children}
      {hoverCard.visible && (
        <div
          ref={cardRef}
          className="HoverCard"
          style={{
            top: hoverCard.y + 10,
            left: hoverCard.x + 10,
          }}
        >
          {hoverCard.content}
        </div>
      )}
    </HoverCardContext.Provider>
  );
};

export const useHoverCard = () => {
  const context = useContext(HoverCardContext);
  if (!context) throw new Error('useHoverCard must be used within a HoverCardProvider');
  return context;
};
