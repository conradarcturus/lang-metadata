import React from 'react';
import './styles.css';

type ButtonGroupSingleChoiceProps<T extends React.Key> = {
  groupLabel?: string;
  onChange: (value: T) => void;
  options: readonly T[];
  renderLabel?: (value: T) => React.ReactNode; // optional label renderer
  selected: T;
};

function ButtonGroupSingleChoice<T extends React.Key>({
  groupLabel,
  onChange,
  options,
  renderLabel = (val) => val as string,
  selected,
}: ButtonGroupSingleChoiceProps<T>) {
  return (
    <div className="selector">
      {groupLabel != null && <label>{groupLabel}</label>}
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={selected === option ? 'selected' : ''}
        >
          {renderLabel(option)}
        </button>
      ))}
    </div>
  );
}

export default ButtonGroupSingleChoice;
