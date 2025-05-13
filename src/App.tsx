import PageNavBar from './controls/PageNavBar';
import { PageParamsProvider } from './controls/PageParamsContext';
import { DataProvider } from './dataloading/DataContext';
import { HoverCardProvider } from './generic/HoverCardContext';
import MainViews from './views/MainViews';
import ViewModal from './views/ViewModal';

function App() {
  return (
    <>
      <PageParamsProvider>
        <DataProvider>
          <HoverCardProvider>
            <PageNavBar />
            <div className="Body">
              <MainViews />
            </div>
            <ViewModal />
          </HoverCardProvider>
        </DataProvider>
      </PageParamsProvider>
    </>
  );
}

export default App;
