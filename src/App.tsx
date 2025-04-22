import './App.css';
import ControlsBar from './controls/ControlsBar';
import { PageParamsProvider } from './controls/PageParamsContext';
import { DataProvider } from './dataloading/DataContext';
import { HoverCardProvider } from './generic/HoverCardContext';
import MainViews from './views/MainViews';

function App() {
  return (
    <>
      <h1>Language Metadata</h1>
      <PageParamsProvider>
        <DataProvider>
          <HoverCardProvider>
            <ControlsBar />
            <MainViews />
          </HoverCardProvider>
        </DataProvider>
      </PageParamsProvider>
    </>
  );
}

export default App;
