import React, { useState } from 'react';

import './styles.css';
import HoverableButton from '../generic/HoverableButton';

type SingleSelectorProps<T extends React.Key> = {
  getOptionDescription?: (value: T) => React.ReactNode;
  getOptionLabel?: (value: T) => React.ReactNode; // optional label renderer
  groupLabel?: string;
  mode?: 'dropdown' | 'flat';
  onChange: (value: T) => void;
  options: readonly T[];
  selected: T;
};

function SingleSelector<T extends React.Key>({
  getOptionDescription = () => undefined,
  getOptionLabel = (val) => val as string,
  groupLabel,
  mode = 'dropdown',
  onChange,
  options,
  selected,
}: SingleSelectorProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const contents = options.map((option) => (
    <HoverableButton
      key={option}
      hoverContent={getOptionDescription(option)}
      onClick={() => {
        setExpanded(false);
        onChange(option);
      }}
      className={selected === option ? 'selected' : ''}
    >
      {getOptionLabel(option)}
    </HoverableButton>
  ));

  return (
    <div className="selector">
      {groupLabel != null && <label>{groupLabel}</label>}
      {mode == 'flat' ? (
        contents
      ) : (
        <>
          <button className="selected LastChild" onClick={() => setExpanded((prev) => !prev)}>
            {getOptionLabel(selected)} ▼
          </button>
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
