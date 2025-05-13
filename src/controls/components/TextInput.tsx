import React, { useEffect, useRef, useState } from 'react';

type Props = {
  inputStyle?: React.CSSProperties;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

const TextInput: React.FC<Props> = ({ inputStyle, onChange, placeholder, value }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(50);

  // Used to calculate the width of the input box
  useEffect(() => {
    if (spanRef.current) {
      setInputWidth(spanRef.current.offsetWidth + 10); // add some buffer
    }
  }, [value]);

  // Using a new variable immediateValue to allow users to edit the input box without causing computational
  // changes that could slow down rendering and cause a bad UX.
  const [immediateValue, setImmediateValue] = useState(value);
  useEffect(() => {
    // If the passed-in value of the text input changes (eg. on page nav) then update the immediate value
    // TODO: This does not always work
    setImmediateValue(value);
  }, [value, setImmediateValue]);

  // When the immediate value changes, it starts a timeout and after enough time it triggers onChange
  useEffect(() => {
    const timer = setTimeout(() => onChange(immediateValue), 300 /* ms */);
    return () => clearTimeout(timer);
  }, [immediateValue]);

  return (
    <>
      <input
        type="text"
        className={immediateValue === '' ? 'empty' : ''}
        value={immediateValue}
        onChange={(ev) => setImmediateValue(ev.target.value)}
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
