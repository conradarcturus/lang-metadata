import './App.css';
import { usePageParams } from './controls/PageParamsContext';
import { ViewType } from './controls/PageParamTypes';
import { useDataContext } from './dataloading/DataContext';
import LanguageCardList from './views/LanguageCardList';
import LanguageDetails from './views/LanguageDetails';
import { HoverCardProvider } from './components/HoverCardContext';

function Body() {
  const { viewType, code } = usePageParams();
  const { languagesByCode } = useDataContext();
  return (
    <HoverCardProvider>
      {viewType === ViewType.CardList && <LanguageCardList />}
      {viewType === ViewType.Details && <LanguageDetails lang={languagesByCode[code]} />}
    </HoverCardProvider>
  );
}

export default Body;
