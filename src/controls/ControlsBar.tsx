import React from 'react';

import LanguageSchemaSelector from './selectors/LanguageSchemaSelector';
import LimitInput from './selectors/LimitInput';
import LocaleSeparatorSelector from './selectors/LocaleSeparatorSelector';
import ScopeFilterSelector from './selectors/ScopeFilterSelector';
import SortBySelector from './selectors/SortBySelector';

import './controls.css';

const ControlsBar: React.FC = () => {
  return (
    <>
      <LanguageSchemaSelector />
      <LimitInput />
      <SortBySelector />
      <ScopeFilterSelector />
      <LocaleSeparatorSelector />
    </>
  );
};

export default ControlsBar;
