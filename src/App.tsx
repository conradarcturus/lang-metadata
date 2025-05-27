import PageNavBar from './controls/PageNavBar';
import { PageParamsProvider } from './controls/PageParamsContext';
import { DataProvider } from './dataloading/DataContext';
import Footer from './Footer';
import { HoverCardProvider } from './generic/HoverCardContext';
import MainViews from './views/MainViews';
import ViewModal from './views/ViewModal';

function App() {
  return (
    <PageParamsProvider>
      <DataProvider>
        <HoverCardProvider>
          <PageNavBar />
          <div className="Body">
            <MainViews />
          </div>
          <ViewModal />
          {/* <footer>
            &copy; 2025 <a href="https://translationcommons.org/">Translation Commons</a>
          </footer> */}
          <Footer />
        </HoverCardProvider>
      </DataProvider>
    </PageParamsProvider>
  );
}

export default App;
