import React from 'react';

type Props = {
  inputStyle?: React.CSSProperties;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

// TODO: needs debouncing
const TextInput: React.FC<Props> = ({ value, onChange, inputStyle, placeholder }) => {
  return (
    <>
      <input
        type="text"
        className={value === '' ? 'empty' : ''}
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        style={inputStyle}
        placeholder={placeholder}
      />
      <button className="NoLeftBorder" type="button" onClick={() => onChange('')}>
        &#x2716;
      </button>
    </>
  );
};

export default TextInput;
