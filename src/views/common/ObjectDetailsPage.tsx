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
    const suggestionsByDimension = {
      [Dimension.Language]: <LanguageSuggestions />,
      [Dimension.Locale]: <LocaleSuggestions />,
      [Dimension.Territory]: <TerritorySuggestions />,
      [Dimension.WritingSystem]: <WritingSystemSuggestions />,
    };

    return (
      <div className="DetailsPage">
        This view shows details about a particular object -- but no object has been specified. Use
        another view (Card List, Hierarchy, Table) to find one or click on one of the suggestions
        below:
        <div style={{ marginBottom: '2em' }}>
          <label>{dimension}</label>
          {suggestionsByDimension[dimension]}
        </div>
        Or try another object type:
        {Object.entries(suggestionsByDimension)
          .filter(([dim]) => dim !== dimension)
          .map(([dim, suggestions]) => (
            <div key={dim} style={{ marginBottom: '1em' }}>
              <label>{dim}</label>
              {suggestions}
            </div>
          ))}
      </div>
    );
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
