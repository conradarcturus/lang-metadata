import { usePageParams } from '../controls/PageParamsContext';
import { Dimension, ViewType } from '../controls/PageParamTypes';
import { HoverCardProvider } from '../generic/HoverCardContext';

import LanguageCardList from './language/LanguageCardList';
import LanguageDetails from './language/LanguageDetails';
import LocaleDetails from './locale/LocaleDetails';
import TerritoryCardList from './territory/TerritoryCardList';
import TerritoryDetails from './territory/TerritoryDetails';
import './styles.css';

function MainViews() {
  const { viewType, dimension } = usePageParams();
  return (
    <HoverCardProvider>
      {dimension === Dimension.Language && (
        <>
          {viewType === ViewType.CardList && <LanguageCardList />}
          {viewType === ViewType.Details && <LanguageDetails />}
        </>
      )}
      {dimension === Dimension.Territory && (
        <>
          {viewType === ViewType.CardList && <TerritoryCardList />}
          {viewType === ViewType.Details && <TerritoryDetails />}
        </>
      )}
      {dimension === Dimension.Locale && (
        <>
          {viewType === ViewType.CardList && 'Not yet implemented'}
          {viewType === ViewType.Details && <LocaleDetails />}
        </>
      )}
    </HoverCardProvider>
  );
}

export default MainViews;
