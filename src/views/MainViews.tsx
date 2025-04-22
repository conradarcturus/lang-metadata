/* eslint-disable no-fallthrough */
import { usePageParams } from '../controls/PageParamsContext';
import { Dimension, ViewType } from '../controls/PageParamTypes';

import LanguageCardList from './language/LanguageCardList';
import LanguageDetails from './language/LanguageDetails';
import LocaleCardList from './locale/LocaleCardList';
import LocaleDetails from './locale/LocaleDetails';
import TerritoryCardList from './territory/TerritoryCardList';
import TerritoryDetails from './territory/TerritoryDetails';
import WritingSystemCardList from './writingsystem/WritingSystemCardList';
import WritingSystemDetails from './writingsystem/WritingSystemDetails';
import './styles.css';

function MainViews() {
  const { viewType, dimension } = usePageParams();
  switch (dimension) {
    case Dimension.Language:
      switch (viewType) {
        case ViewType.CardList:
          return <LanguageCardList />;
        case ViewType.Details:
          return <LanguageDetails />;
      }
    case Dimension.Territory:
      switch (viewType) {
        case ViewType.CardList:
          return <TerritoryCardList />;
        case ViewType.Details:
          return <TerritoryDetails />;
      }
    case Dimension.Locale:
      switch (viewType) {
        case ViewType.CardList:
          return <LocaleCardList />;
        case ViewType.Details:
          return <LocaleDetails />;
      }
    case Dimension.WritingSystem:
      switch (viewType) {
        case ViewType.CardList:
          return <WritingSystemCardList />;
        case ViewType.Details:
          return <WritingSystemDetails />;
      }
  }
}

export default MainViews;
