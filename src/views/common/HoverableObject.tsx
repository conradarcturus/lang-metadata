import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import Hoverable from '../../generic/Hoverable';
import { ObjectData } from '../../types/DataTypes';
import { Dimension } from '../../types/PageParamTypes';
import LanguageCard from '../language/LanguageCard';
import LocaleCard from '../locale/LocaleCard';
import TerritoryCard from '../territory/TerritoryCard';
import WritingSystemCard from '../writingsystem/WritingSystemCard';

type Props = {
  object: ObjectData;
  children: React.ReactNode;
};

const HoverableObject: React.FC<Props> = ({ object, children }) => {
  const { viewType, updatePageParams } = usePageParams();

  const getHoverContent = () => {
    switch (object.type) {
      case Dimension.Language:
        return <LanguageCard lang={object} />;
      case Dimension.Locale:
        return <LocaleCard locale={object} />;
      case Dimension.Territory:
        return <TerritoryCard territory={object} />;
      case Dimension.WritingSystem:
        return <WritingSystemCard writingSystem={object} />;
    }
  };

  return (
    <Hoverable
      hoverContent={
        <>
          Click to{' '}
          {viewType == 'Details'
            ? 'change page to see the details for:'
            : 'open modal with more information for:'}
          {getHoverContent()}
        </>
      }
      onClick={() => updatePageParams({ objectID: object.ID })}
    >
      {children}
    </Hoverable>
  );
};

export default HoverableObject;
