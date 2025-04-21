import './App.css';
import { usePageParams } from './controls/PageParamsContext';
import { Dimension, ViewType } from './controls/PageParamTypes';
import { useDataContext } from './dataloading/DataContext';
import LanguageCardList from './views/LanguageCardList';
import LanguageDetails from './views/LanguageDetails';
import { HoverCardProvider } from './components/HoverCardContext';
import TerritoryCardList from './views/TerritoryCardList';
import TerritoryDetails from './views/TerritoryDetails';

function Body() {
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

export default Body;
