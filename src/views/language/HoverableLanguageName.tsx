import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import Hoverable from '../../generic/Hoverable';
import { LanguageData } from '../../types/LanguageTypes';

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
      onClick={() => updatePageParams({ objectID: lang.ID })}
      style={style}
    >
      {format === 'text' ? lang.nameDisplay : <button>{lang.nameDisplay}</button>}
    </Hoverable>
  );
};

export default HoverableLanguageName;
