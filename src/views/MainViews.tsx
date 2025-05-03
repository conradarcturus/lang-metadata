import { usePageParams } from '../controls/PageParamsContext';
import { Dimension, ViewType } from '../controls/PageParamTypes';

import TreeList from './common/TreeList/ViewTreeList';
import LanguageCardList from './language/LanguageCardList';
import LanguageDetailsPage from './language/LanguageDetailsPage';
import LocaleCardList from './locale/LocaleCardList';
import LocaleDetailsPage from './locale/LocaleDetailsPage';
import TerritoryCardList from './territory/TerritoryCardList';
import TerritoryDetailsPage from './territory/TerritoryDetailsPage';
import ViewWarnings from './ViewWarnings';
import WritingSystemCardList from './writingsystem/WritingSystemCardList';
import WritingSystemDetailsPage from './writingsystem/WritingSystemDetailsPage';
import './styles.css';

function MainViews() {
  const { viewType, dimension } = usePageParams();

  switch (viewType) {
    case ViewType.CardList:
      switch (dimension) {
        case Dimension.Language:
          return <LanguageCardList />;
        case Dimension.Territory:
          return <TerritoryCardList />;
        case Dimension.Locale:
          return <LocaleCardList />;
        case Dimension.WritingSystem:
          return <WritingSystemCardList />;
      }
    // eslint-disable-next-line no-fallthrough
    case ViewType.Details:
      switch (dimension) {
        case Dimension.Language:
          return <LanguageDetailsPage />;
        case Dimension.Territory:
          return <TerritoryDetailsPage />;
        case Dimension.Locale:
          return <LocaleDetailsPage />;
        case Dimension.WritingSystem:
          return <WritingSystemDetailsPage />;
      }
    // eslint-disable-next-line no-fallthrough
    case ViewType.Hierarchy:
      return <TreeList />;
    case ViewType.Warnings:
      return <ViewWarnings />;
  }
}

export default MainViews;
