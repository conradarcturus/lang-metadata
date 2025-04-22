import { usePageParams } from '../controls/PageParamsContext';
import { Dimension, ViewType } from '../controls/PageParamTypes';
import { useDataContext } from '../dataloading/DataContext';
import { HoverCardProvider } from '../generic/HoverCardContext';

import LanguageCardList from './cardlists/LanguageCardList';
import TerritoryCardList from './cardlists/TerritoryCardList';
import LanguageDetails from './details/LanguageDetails';
import TerritoryDetails from './details/TerritoryDetails';
import './styles.css';

function MainViews() {
  const { viewType, code, dimension } = usePageParams();
  const { languagesByCode, territoriesByCode } = useDataContext();
  return (
    <HoverCardProvider>
      {dimension === Dimension.Language && (
        <>
          {viewType === ViewType.CardList && <LanguageCardList />}
          {viewType === ViewType.Details && <LanguageDetails lang={languagesByCode[code]} />}
        </>
      )}
      {dimension === Dimension.Territory && (
        <>
          {viewType === ViewType.CardList && <TerritoryCardList />}
          {viewType === ViewType.Details && (
            <TerritoryDetails territory={territoriesByCode[code]} />
          )}
        </>
      )}
    </HoverCardProvider>
  );
}

export default MainViews;
