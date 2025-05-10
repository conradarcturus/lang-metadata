import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import { ObjectData } from '../../types/DataTypes';
import { Dimension } from '../../types/PageParamTypes';
import LanguageDetails from '../language/LanguageDetails';
import LocaleDetails from '../locale/LocaleDetails';
import TerritoryDetails from '../territory/TerritoryDetails';
import WritingSystemDetails from '../writingsystem/WritingSystemDetails';

// You can get the details by an object or just its ID
type Props = { object?: ObjectData; objectID?: string };

const ObjectDetails: React.FC<Props> = ({ object, objectID }) => {
  if (object == null) {
    if (objectID != null) {
      return <ObjectDetails object={getObjectFromID(objectID)} />;
    }
    return <></>;
  }

  switch (object.type) {
    case Dimension.Language:
      return <LanguageDetails lang={object} />;
    case Dimension.Locale:
      return <LocaleDetails locale={object} />;
    case Dimension.Territory:
      return <TerritoryDetails territory={object} />;
    case Dimension.WritingSystem:
      return <WritingSystemDetails writingSystem={object} />;
  }
};

export function getObjectFromID(inputObjectID?: string): ObjectData | undefined {
  const { objectID: pageObjectID } = usePageParams();
  const { languagesBySchema, territories, writingSystems, locales } = useDataContext();
  const objectID = inputObjectID ?? pageObjectID;

  if (objectID == null) return undefined;

  return (
    languagesBySchema.Inclusive[objectID] ??
    languagesBySchema.Glottolog[objectID] ?? // The Glottolog lookup should no longer be necessary since objects have a stable ID field, but keep just in case
    territories[objectID] ??
    locales[objectID] ??
    writingSystems[objectID]
  );
}

export default ObjectDetails;
