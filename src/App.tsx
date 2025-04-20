import './App.css';
import { DataProvider } from './dataloading/DataContext';
import LanguageCardList from './views/LanguageCardList';

function App() {
  return (
    <>
      <h1>Language Metadata</h1>
      <DataProvider>
        <LanguageCardList />
      </DataProvider>
    </>
  );
}

export default App;
