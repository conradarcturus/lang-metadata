import React from 'react';

import './styles.css';
import HoverableButton from '../generic/HoverableButton';

type MultiSelectorProps<T extends React.Key> = {
  getOptionDescription?: (value: T) => React.ReactNode;
  getOptionLabel?: (value: T) => React.ReactNode; // optional label renderer
  groupLabel?: string;
  onToggleOption: (value: T) => void;
  options: readonly T[];
  selected: T[];
};

function MultiSelector<T extends React.Key>({
  getOptionDescription = () => undefined,
  getOptionLabel = (val) => val as string,
  groupLabel,
  onToggleOption,
  options,
  selected,
}: MultiSelectorProps<T>) {
  return (
    <div className="selector">
      {groupLabel != null && <label>{groupLabel}</label>}
      {options.map((option) => (
        <HoverableButton
          key={option}
          hoverContent={getOptionDescription(option)}
          onClick={() => onToggleOption(option)}
          className={selected.includes(option) ? 'selected' : ''}
        >
          {getOptionLabel(option)}
        </HoverableButton>
      ))}
    </div>
  );
}

export default MultiSelector;
