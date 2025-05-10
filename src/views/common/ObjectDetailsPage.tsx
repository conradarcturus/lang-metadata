import React, { useEffect } from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { Dimension } from '../../types/PageParamTypes';
import LanguageSuggestions from '../language/LanguageSuggestions';
import LocaleSuggestions from '../locale/LocaleSuggestions';
import TerritorySuggestions from '../territory/TerritorySuggestions';
import WritingSystemSuggestions from '../writingsystem/WritingSystemSuggestions';

import ObjectDetails, { getObjectFromID } from './ObjectDetails';
import ObjectTitle from './ObjectTitle';

const ObjectDetailsPage: React.FC = () => {
  const { dimension, updatePageParams } = usePageParams();
  const object = getObjectFromID();

  useEffect(() => {
    if (object?.type != null) updatePageParams({ dimension: object?.type });
  }, [object?.type]);

  if (object == null) {
    switch (dimension) {
      case Dimension.Language:
        return <LanguageSuggestions />;
      case Dimension.Locale:
        return <LocaleSuggestions />;
      case Dimension.Territory:
        return <TerritorySuggestions />;
      case Dimension.WritingSystem:
        return <WritingSystemSuggestions />;
    }
  }

  return (
    <div className="DetailsPage">
      <h2>
        <ObjectTitle object={object} />
      </h2>
      <ObjectDetails object={object} />
    </div>
  );
};

export default ObjectDetailsPage;
