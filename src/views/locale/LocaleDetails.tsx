import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import HoverableLanguageName from '../language/HoverableLanguageName';
import HoverableTerritoryName from '../territory/HoverableTerritoryName';

import HoverableLocaleName from './HoverableLocaleName';
import { getLocaleName, getOfficialLabel, getPopulationCitation } from './LocaleStrings';

const LocaleDetails: React.FC = () => {
  const { code } = usePageParams();
  const { locales } = useDataContext();
  const locale = locales[code];

  if (locale == null) {
    return (
      <div className="Details" style={{ textAlign: 'center' }}>
        No locale selected. Enter a locale code in the search bar. See common locales:
        <div className="separatedButtonList">
          {['eng_US', 'spa_MX', 'fra_FR', 'deu_DE', 'zho_Hans_CN', 'ara_EG'].map(
            (code) =>
              locales[code] != null && (
                <HoverableLocaleName key={code} locale={locales[code]} format="button" />
              ),
          )}
        </div>
      </div>
    );
  }

  const {
    explicitScriptCode,
    language,
    languageCode,
    officialStatus,
    populationEstimate,
    populationPercentOfTerritory,
    territory,
    territoryCode,
    variantTag,
  } = locale;

  return (
    <div className="Details">
      <h2>
        <strong>{getLocaleName(locale)}</strong> [{code}]
      </h2>
      <div>
        <h3>Definition</h3>
        <div>
          <label>Language:</label>
          {language ? (
            <HoverableLanguageName lang={language} />
          ) : (
            <span>
              {languageCode} <em>[language not in database]</em>
            </span>
          )}
        </div>
        <div>
          <label>Territory:</label>
          {territory ? (
            <HoverableTerritoryName territory={territory} />
          ) : (
            <span>
              {territoryCode} <em>[territory not in database]</em>
            </span>
          )}
        </div>

        {explicitScriptCode && (
          <div>
            <label>Writing System:</label>
            {explicitScriptCode} <em>[script not in database]</em>
          </div>
        )}

        {variantTag && (
          <div>
            <label>Variant:</label>
            {variantTag} <em>[variant not in database]</em>
          </div>
        )}
      </div>
      <div>
        <h3>Attributes</h3>
        <div>
          <label>Speakers:</label>
          {populationEstimate.toLocaleString()}
          {' ['}
          {getPopulationCitation(locale)}
          {']'}
        </div>

        {populationPercentOfTerritory != null && (
          <div>
            <label>Percent of Country:</label>
            {populationPercentOfTerritory.toFixed(1)}%
          </div>
        )}
        <div>
          <label>Government status:</label>
          {getOfficialLabel(officialStatus)}
        </div>
      </div>
    </div>
  );
};

export default LocaleDetails;
