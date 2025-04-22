import { usePageParams } from '../controls/PageParamsContext';
import { Dimension, ViewType } from '../controls/PageParamTypes';
import { HoverCardProvider } from '../generic/HoverCardContext';

import LanguageCardList from './cardlists/LanguageCardList';
import TerritoryCardList from './cardlists/TerritoryCardList';
import LanguageDetails from './details/LanguageDetails';
import TerritoryDetails from './details/TerritoryDetails';
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
          {viewType === ViewType.Details && 'Not yet implemented'}
        </>
      )}
    </HoverCardProvider>
  );
}

export default MainViews;
