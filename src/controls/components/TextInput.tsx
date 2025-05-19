import React, { useEffect, useRef, useState } from 'react';

export type Suggestion = {
  id: string;
  label: React.ReactNode;
};

type Props = {
  inputStyle?: React.CSSProperties;
  getSuggestions?: (query: string) => Promise<Suggestion[]>;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

const TextInput: React.FC<Props> = ({
  inputStyle,
  getSuggestions = () => [],
  onChange,
  placeholder,
  value,
}) => {
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

  // Handle suggestions
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {
    let active = true;
    (async () => {
      const result = await getSuggestions(immediateValue);
      if (active) setSuggestions(result.slice(0, 10));
    })();
    return () => {
      active = false;
    };
  }, [getSuggestions, immediateValue]);

  return (
    <>
      <input
        type="text"
        className={immediateValue === '' ? 'empty' : ''}
        value={immediateValue}
        onChange={(ev) => {
          setImmediateValue(ev.target.value);
          setShowSuggestions(true);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 500)}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        style={{ ...inputStyle, width: inputWidth + 5 }}
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
      {showSuggestions && suggestions.length > 0 && (
        <div className="SelectorPopupAnchor">
          <div className="SelectorPopup">
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setImmediateValue(s.id);
                  setShowSuggestions(false);
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        className="NoLeftBorder"
        type="button"
        onClick={() => {
          setImmediateValue('');
          setShowSuggestions(false);
        }}
      >
        &#x2716;
      </button>
    </>
  );
};

export default TextInput;
