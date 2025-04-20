import './App.css';
import { usePageParams } from './controls/PageParamsContext';
import { ViewType } from './controls/PageParamTypes';
import LanguageCardList from './views/LanguageCardList';

function Body() {
  const { viewType } = usePageParams();
  return (
    <>
      {viewType === ViewType.CardList && <LanguageCardList />}
      {viewType === ViewType.Details && <div>Not implemented yet</div>}
    </>
  );
}

export default Body;
