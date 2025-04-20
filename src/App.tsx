import './App.css';
import Body from './Body';
import ControlsBar from './controls/ControlsBar';
import { PageParamsProvider } from './controls/PageParamsContext';
import { DataProvider } from './dataloading/DataContext';

function App() {
  return (
    <>
      <h1>Language Metadata</h1>
      <PageParamsProvider>
        <DataProvider>
          <ControlsBar />
          <Body />
        </DataProvider>
      </PageParamsProvider>
    </>
  );
}

export default App;
