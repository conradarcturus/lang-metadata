import { usePageParams } from '../controls/PageParamsContext';
import { Dimension, ViewType } from '../controls/PageParamTypes';

import LanguageCardList from './language/LanguageCardList';
import LanguageDetailsPage from './language/LanguageDetailsPage';
import { LanguageHierarchy } from './language/LanguageHierarchy';
import LanguageTable from './language/LanguageTable';
import LocaleCardList from './locale/LocaleCardList';
import LocaleDetailsPage from './locale/LocaleDetailsPage';
import { LocaleHierarchy } from './locale/LocaleHierarchy';
import LocaleTable from './locale/LocaleTable';
import TerritoryCardList from './territory/TerritoryCardList';
import TerritoryDetailsPage from './territory/TerritoryDetailsPage';
import { TerritoryHierarchy } from './territory/TerritoryHierarchy';
import TerritoryTable from './territory/TerritoryTable';
import ViewWarnings from './ViewWarnings';
import WritingSystemCardList from './writingsystem/WritingSystemCardList';
import WritingSystemDetailsPage from './writingsystem/WritingSystemDetailsPage';
import { WritingSystemHierarchy } from './writingsystem/WritingSystemHierarchy';
import WritingSystemTable from './writingsystem/WritingSystemTable';
import './styles.css';

function MainViews() {
  const { viewType, dimension } = usePageParams();

  switch (viewType) {
    case ViewType.CardList:
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
    case ViewType.Details:
      switch (dimension) {
        case Dimension.Language:
          return <LanguageDetailsPage />;
        case Dimension.Locale:
          return <LocaleDetailsPage />;
        case Dimension.Territory:
          return <TerritoryDetailsPage />;
        case Dimension.WritingSystem:
          return <WritingSystemDetailsPage />;
      }
    // eslint-disable-next-line no-fallthrough
    case ViewType.Hierarchy:
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
    case ViewType.Table:
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
    case ViewType.Warnings:
      return <ViewWarnings />;
  }
}

export default MainViews;
