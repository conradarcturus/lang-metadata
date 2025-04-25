import React from 'react';

type Props = {
  inputStyle?: React.CSSProperties;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

const TextInput: React.FC<Props> = ({ label, value, onChange, inputStyle, placeholder }) => {
  return (
    <div className="selector">
      <label>{label}</label>
      <input
        type="text"
        className={value === '' ? 'empty' : ''}
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        style={inputStyle}
        placeholder={placeholder}
      />
      <button className="clear" type="button" onClick={() => onChange('')}>
        &#x2716;
      </button>
    </div>
  );
};

export default TextInput;
