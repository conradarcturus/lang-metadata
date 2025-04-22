import { usePageParams } from '../../controls/PageParamsContext';
import { useDataContext } from '../../dataloading/DataContext';
import { LocaleData } from '../../DataTypes';
import HoverableLocaleName from '../cards/HoverableLocaleName';

const LocaleDetails: React.FC = () => {
  const { code } = usePageParams();
  const { locales } = useDataContext();

  const getLocale = (code: string): LocaleData | null =>
    locales.filter((locale) => locale.code === code)[0];
  const locale = getLocale(code);

  if (locale == null) {
    return (
      <div className="Details" style={{ textAlign: 'center' }}>
        No locale selected. Enter a locale code in the search bar. See common locales:
        <div className="separatedButtonList">
          {['eng_US', 'spa_MX', 'fra_FR', 'deu_DE', 'zho_Hans_CN', 'ara_EG'].map((code) => {
            const locale = getLocale(code);
            return (
              locale != null && <HoverableLocaleName key={code} locale={locale} format="button" />
            );
          })}
        </div>
      </div>
    );
  }

  return 'Actual Locale details (not a hovercard) have not been implemented yet.';
};

export default LocaleDetails;
