/* eslint-disable no-fallthrough */
import { usePageParams } from '../controls/PageParamsContext';
import { Dimension, ViewType } from '../controls/PageParamTypes';

import LanguageCardList from './language/LanguageCardList';
import LanguageDetailsPage from './language/LanguageDetailsPage';
import LocaleCardList from './locale/LocaleCardList';
import LocaleDetailsPage from './locale/LocaleDetailsPage';
import TerritoryCardList from './territory/TerritoryCardList';
import TerritoryDetailsPage from './territory/TerritoryDetailsPage';
import TreeList from './ViewTreeList';
import WritingSystemCardList from './writingsystem/WritingSystemCardList';
import WritingSystemDetailsPage from './writingsystem/WritingSystemDetailsPage';
import './styles.css';

function MainViews() {
  const { viewType, dimension } = usePageParams();
  switch (dimension) {
    case Dimension.Language:
      switch (viewType) {
        case ViewType.CardList:
          return <LanguageCardList />;
        case ViewType.Details:
          return <LanguageDetailsPage />;
        case ViewType.Hierarchy:
          return <TreeList />;
      }
    case Dimension.Territory:
      switch (viewType) {
        case ViewType.CardList:
          return <TerritoryCardList />;
        case ViewType.Details:
          return <TerritoryDetailsPage />;
        case ViewType.Hierarchy:
          return <TreeList />;
      }
    case Dimension.Locale:
      switch (viewType) {
        case ViewType.CardList:
          return <LocaleCardList />;
        case ViewType.Details:
          return <LocaleDetailsPage />;
        case ViewType.Hierarchy:
          return <TreeList />;
      }
    case Dimension.WritingSystem:
      switch (viewType) {
        case ViewType.CardList:
          return <WritingSystemCardList />;
        case ViewType.Details:
          return <WritingSystemDetailsPage />;
        case ViewType.Hierarchy:
          return <TreeList />;
      }
  }
}

export default MainViews;
