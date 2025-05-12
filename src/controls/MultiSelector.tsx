import React, { useState } from 'react';

import './styles.css';
import Hoverable from '../generic/Hoverable';
import HoverableButton from '../generic/HoverableButton';

type MultiSelectorProps<T extends React.Key> = {
  getOptionDescription?: (value: T) => React.ReactNode;
  getOptionLabel?: (value: T) => React.ReactNode; // optional label renderer
  selectorLabel?: string;
  selectorDescription?: React.ReactNode;
  mode?: 'flat' | 'dropdown';
  onToggleOption: (value: T) => void;
  options: readonly T[];
  selected: T[];
};

function MultiSelector<T extends React.Key>({
  getOptionDescription = () => undefined,
  getOptionLabel = (val) => val as string,
  selectorLabel,
  selectorDescription,
  mode,
  onToggleOption,
  options,
  selected,
}: MultiSelectorProps<T>) {
  const contents = options.map((option) => {
    const optionDescription = getOptionDescription(option);
    return (
      <HoverableButton
        key={option}
        className={selected.includes(option) ? 'selected' : ''}
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
        onClick={() => onToggleOption(option)}
      >
        {getOptionLabel(option)}
      </HoverableButton>
    );
  });
  const [expanded, setExpanded] = useState(false);

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
            className={`${selected.length > 0 && 'selected '}LastChild`}
            onClick={() => setExpanded((prev) => !prev)}
          >
            {selected.length === 0 && 'None selected'}
            {selected.length === 1 && getOptionLabel(selected[0])}
            {selected.length > 1 && 'Multiple selected'} ▼
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

export default MultiSelector;
