import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import Hoverable from '../../generic/Hoverable';
import { LocaleData } from '../../types/DataTypes';

import LocaleCard from './LocaleCard';

type Props = {
  locale: LocaleData;
  labelSource?: 'code' | 'territory' | 'language';
  format?: 'text' | 'button';
  style?: React.CSSProperties;
};

const HoverableLocaleName: React.FC<Props> = ({
  locale,
  labelSource = 'code',
  format = 'text',
  style,
}) => {
  const { updatePageParams } = usePageParams();
  let label = locale.code;
  switch (labelSource) {
    case 'language':
      label = locale.language?.nameDisplay ?? locale.languageCode;
      break;
    case 'territory':
      label = locale.territory?.nameDisplay ?? locale.territoryCode;
      break;
    case 'code':
    // base case
  }

  return (
    <Hoverable
      hoverContent={<LocaleCard locale={locale} />}
      onClick={() => updatePageParams({ modalObject: locale.code })}
      style={style}
    >
      {format === 'text' ? label : <button>{label}</button>}
    </Hoverable>
  );
};

export default HoverableLocaleName;
