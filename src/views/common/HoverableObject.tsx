import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { Dimension } from '../../types/PageParamTypes';
import { ObjectData } from '../../types/DataTypes';
import Hoverable from '../../generic/Hoverable';
import LanguageCard from '../language/LanguageCard';
import LocaleCard from '../locale/LocaleCard';
import TerritoryCard from '../territory/TerritoryCard';
import WritingSystemCard from '../writingsystem/WritingSystemCard';

type Props = {
  object: ObjectData;
  children: React.ReactNode;
};

const HoverableObject: React.FC<Props> = ({ object, children }) => {
  const { updatePageParams } = usePageParams();

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
      hoverContent={getHoverContent()}
      onClick={() => updatePageParams({ modalObject: object.code })}
    >
      {children}
    </Hoverable>
  );
};

export default HoverableObject;
