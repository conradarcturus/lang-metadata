import React, { useState } from 'react';

import './styles.css';
import Hoverable from '../generic/Hoverable';
import HoverableButton from '../generic/HoverableButton';

type SingleSelectorProps<T extends React.Key> = {
  getOptionDescription?: (value: T) => React.ReactNode;
  getOptionLabel?: (value: T) => React.ReactNode; // optional label renderer
  selectorLabel?: string;
  selectorDescription?: React.ReactNode;
  mode?: 'dropdown' | 'flat';
  onChange: (value: T) => void;
  options: readonly T[];
  selected: T;
};

function SingleSelector<T extends React.Key>({
  getOptionDescription = () => undefined,
  getOptionLabel = (val) => val as string,
  selectorLabel,
  selectorDescription,
  mode = 'dropdown',
  onChange,
  options,
  selected,
}: SingleSelectorProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const contents = options.map((option) => {
    const optionDescription = getOptionDescription(option);
    return (
      <HoverableButton
        key={option}
        className={selected === option ? 'selected' : ''}
        hoverContent={
          mode === 'flat' && optionDescription ? (
            <>
              <div style={{ marginBottom: 8 }}>{selectorDescription}</div>
              {optionDescription}
            </>
          ) : (
            optionDescription
          )
        }
        onClick={() => {
          setExpanded(false);
          onChange(option);
        }}
      >
        {getOptionLabel(option)}
      </HoverableButton>
    );
  });

  return (
    <div className="selector">
      {selectorLabel != null && (
        <label>
          <Hoverable hoverContent={selectorDescription} style={{ textDecoration: 'none' }}>
            {selectorLabel}
          </Hoverable>
        </label>
      )}
      {mode == 'flat' ? (
        contents
      ) : (
        <>
          <HoverableButton
            hoverContent={selectorDescription}
            className="selected LastChild"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {getOptionLabel(selected)} {expanded ? `▼` : `▶`}
          </HoverableButton>
          {expanded && (
            <div className="SelectorPopupAnchor">
              <div className="SelectorPopup">{contents}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SingleSelector;
