import React from 'react';

import FilterControls from './FilterControls';
import DimensionSelector from './selectors/DimensionSelector';
import LanguageSchemaSelector from './selectors/LanguageSchemaSelector';
import ViewSelector from './selectors/ViewSelector';

const ControlsBar: React.FC = () => {
  return (
    <div className="controlsBar">
      <div>
        <DimensionSelector />
        <ViewSelector />
        <LanguageSchemaSelector />
      </div>
      <FilterControls />
    </div>
  );
};

export default ControlsBar;
