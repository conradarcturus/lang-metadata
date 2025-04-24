import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { Dimension, ViewType } from '../../controls/PageParamTypes';
import { LanguageData } from '../../DataTypes';
import Hoverable from '../../generic/Hoverable';

import LanguageCard from './LanguageCard';

type Props = {
  lang: LanguageData;
  format?: 'text' | 'button';
  style?: React.CSSProperties;
};

const HoverableLanguageName: React.FC<Props> = ({ lang, format = 'text', style }) => {
  const { updatePageParams } = usePageParams();

  return (
    <Hoverable
      hoverContent={<LanguageCard lang={lang} />}
      onClick={() =>
        updatePageParams({
          code: lang.code,
          viewType: ViewType.Details,
          dimension: Dimension.Language,
        })
      }
      style={style}
    >
      {format === 'text' ? lang.nameDisplayTitle : <button>{lang.nameDisplayTitle}</button>}
    </Hoverable>
  );
};

export default HoverableLanguageName;
