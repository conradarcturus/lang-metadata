import React, { useState } from 'react';

import CodeFilterInput from './selectors/CodeFilterInput';
import DimensionSelector from './selectors/DimensionSelector';
import LanguageSchemaSelector from './selectors/LanguageSchemaSelector';
import LimitInput from './selectors/LimitInput';
import LocaleSeparatorSelector from './selectors/LocaleSeparatorSelector';
import NameFilterInput from './selectors/NameFilterInput';
import ScopeFilterSelector from './selectors/ScopeFilterSelector';
import SortBySelector from './selectors/SortBySelector';
import ViewSelector from './selectors/ViewSelector';

const ControlsBar: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="controlsBar">
      <DimensionSelector />
      <ViewSelector />
      <div className="selector">
        <button
          className={showFilters ? 'selected' : ''}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          Filters {showFilters ? `▼` : `▶`}
        </button>
      </div>
      {showFilters && (
        <div>
          <LanguageSchemaSelector />
          <CodeFilterInput />
          <NameFilterInput />
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
