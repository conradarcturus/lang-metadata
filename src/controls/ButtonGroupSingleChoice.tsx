import React from 'react';

import './styles.css';
import HoverableButton from '../generic/HoverableButton';

type ButtonGroupSingleChoiceProps<T extends React.Key> = {
  getOptionDescription?: (value: T) => React.ReactNode;
  getOptionLabel?: (value: T) => React.ReactNode; // optional label renderer
  groupLabel?: string;
  onChange: (value: T) => void;
  options: readonly T[];
  selected: T;
};

function ButtonGroupSingleChoice<T extends React.Key>({
  getOptionDescription = () => undefined,
  getOptionLabel = (val) => val as string,
  groupLabel,
  onChange,
  options,
  selected,
}: ButtonGroupSingleChoiceProps<T>) {
  return (
    <div className="selector">
      {groupLabel != null && <label>{groupLabel}</label>}
      {options.map((option) => (
        <HoverableButton
          key={option}
          hoverContent={getOptionDescription(option)}
          onClick={() => onChange(option)}
          className={selected === option ? 'selected' : ''}
        >
          {getOptionLabel(option)}
        </HoverableButton>
      ))}
    </div>
  );
}

export default ButtonGroupSingleChoice;
