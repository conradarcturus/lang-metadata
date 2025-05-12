import React, { useState } from 'react';

import DimensionSelector from './selectors/DimensionSelector';
import LanguageSchemaSelector from './selectors/LanguageSchemaSelector';
import LimitInput from './selectors/LimitInput';
import LocaleSeparatorSelector from './selectors/LocaleSeparatorSelector';
import ScopeFilterSelector from './selectors/ScopeFilterSelector';
import SearchBar from './selectors/SearchBar';
import SortBySelector from './selectors/SortBySelector';
import ViewSelector from './selectors/ViewSelector';

import './styles.css';

const ControlsBar: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="controlsBar">
      <DimensionSelector />
      <ViewSelector />
      <SearchBar />
      <div className="selector">
        <button
          className={showFilters ? 'selected' : ''}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          Options {showFilters ? `▼` : `▶`}
        </button>
      </div>
      {showFilters && (
        <div>
          <LanguageSchemaSelector />
          <LimitInput />
          <SortBySelector />
          <ScopeFilterSelector />
          <LocaleSeparatorSelector />
        </div>
      )}
    </div>
  );
};

export default ControlsBar;
