import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
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
      onClick={() => updatePageParams({ modalObject: lang.code })}
      style={style}
    >
      {format === 'text' ? lang.nameDisplayTitle : <button>{lang.nameDisplayTitle}</button>}
    </Hoverable>
  );
};

export default HoverableLanguageName;
