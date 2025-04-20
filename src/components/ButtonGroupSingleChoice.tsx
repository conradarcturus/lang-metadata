import React from 'react';
import './styles.css';

type ButtonGroupSingleChoiceProps<T extends React.Key> = {
  options: readonly T[];
  selected: T;
  onChange: (value: T) => void;
  renderLabel?: (value: T) => React.ReactNode; // optional label renderer
};

function ButtonGroupSingleChoice<T extends React.Key>({
  options,
  selected,
  onChange,
  renderLabel = (val) => val as string,
}: ButtonGroupSingleChoiceProps<T>) {
  return (
    <div className="ButtonGroupSingleChoice" style={{ display: 'inline-block' }}>
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
