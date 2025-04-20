import React from 'react';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputStyle?: React.CSSProperties;
};

const TextInput: React.FC<Props> = ({ label, value, onChange, inputStyle }) => {
  return (
    <div className="selector">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        style={inputStyle}
      />
      <button className="clear" type="button" onClick={() => onChange('')}>
        &#x2716;
      </button>
    </div>
  );
};

export default TextInput;
