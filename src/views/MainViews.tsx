import { usePageParams } from '../controls/PageParamsContext';
import { Dimension, View } from '../types/PageParamTypes';

import ObjectDetailsPage from './common/ObjectDetailsPage';
import LanguageCardList from './language/LanguageCardList';
import { LanguageHierarchy } from './language/LanguageHierarchy';
import LanguageTable from './language/LanguageTable';
import LocaleCardList from './locale/LocaleCardList';
import { LocaleHierarchy } from './locale/LocaleHierarchy';
import LocaleTable from './locale/LocaleTable';
import TerritoryCardList from './territory/TerritoryCardList';
import { TerritoryHierarchy } from './territory/TerritoryHierarchy';
import TerritoryTable from './territory/TerritoryTable';
import ViewWarnings from './ViewWarnings';
import WritingSystemCardList from './writingsystem/WritingSystemCardList';
import { WritingSystemHierarchy } from './writingsystem/WritingSystemHierarchy';
import WritingSystemTable from './writingsystem/WritingSystemTable';
import './styles.css';

function MainViews() {
  const { view, dimension } = usePageParams();

  switch (view) {
    case View.CardList:
      switch (dimension) {
        case Dimension.Language:
          return <LanguageCardList />;
        case Dimension.Locale:
          return <LocaleCardList />;
        case Dimension.Territory:
          return <TerritoryCardList />;
        case Dimension.WritingSystem:
          return <WritingSystemCardList />;
      }
    // eslint-disable-next-line no-fallthrough
    case View.Details:
      return <ObjectDetailsPage />;
    case View.Hierarchy:
      switch (dimension) {
        case Dimension.Language:
          return <LanguageHierarchy />;
        case Dimension.Locale:
          return <LocaleHierarchy />;
        case Dimension.Territory:
          return <TerritoryHierarchy />;
        case Dimension.WritingSystem:
          return <WritingSystemHierarchy />;
      }
    // eslint-disable-next-line no-fallthrough
    case View.Table:
      switch (dimension) {
        case Dimension.Language:
          return <LanguageTable />;
        case Dimension.Locale:
          return <LocaleTable />;
        case Dimension.Territory:
          return <TerritoryTable />;
        case Dimension.WritingSystem:
          return <WritingSystemTable />;
      }
    // eslint-disable-next-line no-fallthrough
    case View.Notices:
      return <ViewWarnings />;
  }
}

export default MainViews;
