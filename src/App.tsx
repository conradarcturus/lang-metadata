import './App.css';
import ControlsBar from './controls/ControlsBar';
import { PageParamsProvider } from './controls/PageParamsContext';
import { DataProvider } from './dataloading/DataContext';
import { HoverCardProvider } from './generic/HoverCardContext';
import MainViews from './views/MainViews';
import ViewModal from './views/ViewModal';

function App() {
  return (
    <>
      <h1>
        {/* href resets the page parameters */}
        <a href="/">Language Metadata</a>
      </h1>
      <PageParamsProvider>
        <DataProvider>
          <HoverCardProvider>
            <ControlsBar />
            <MainViews />
            <ViewModal />
          </HoverCardProvider>
        </DataProvider>
      </PageParamsProvider>
    </>
  );
}

export default App;
