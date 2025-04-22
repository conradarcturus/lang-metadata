import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { Dimension, ViewType } from '../../controls/PageParamTypes';
import { LocaleData } from '../../DataTypes';
import Hoverable from '../../generic/Hoverable';

import LocaleCard from './LocaleCard';

type Props = {
  locale: LocaleData;
  format?: 'text' | 'button';
};

const HoverableLocaleName: React.FC<Props> = ({ locale, format = 'text' }) => {
  const { updatePageParams } = usePageParams();

  return (
    <Hoverable
      hoverContent={<LocaleCard locale={locale} />}
      onClick={() =>
        updatePageParams({
          code: locale.code,
          viewType: ViewType.Details,
          dimension: Dimension.Locale,
        })
      }
    >
      {format === 'text' ? locale.code : <button>{locale.code}</button>}
    </Hoverable>
  );
};

export default HoverableLocaleName;
