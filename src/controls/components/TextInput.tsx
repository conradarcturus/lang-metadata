import React, { useEffect, useRef, useState } from 'react';

type Props = {
  inputStyle?: React.CSSProperties;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

// TODO: needs debouncing
const TextInput: React.FC<Props> = ({ value, onChange, inputStyle, placeholder }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(50);

  useEffect(() => {
    if (spanRef.current) {
      setInputWidth(spanRef.current.offsetWidth + 10); // add some buffer
    }
  }, [value]);

  return (
    <>
      <input
        type="text"
        className={value === '' ? 'empty' : ''}
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        style={{ ...inputStyle, width: inputWidth + 5 }}
        placeholder={placeholder}
      />
      <span
        ref={spanRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre',
          font: 'inherit',
        }}
      >
        {value || ' '}
      </span>
      <button className="NoLeftBorder" type="button" onClick={() => onChange('')}>
        &#x2716;
      </button>
    </>
  );
};

export default TextInput;
