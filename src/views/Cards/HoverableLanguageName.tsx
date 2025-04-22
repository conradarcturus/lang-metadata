import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { Dimension, ViewType } from '../../controls/PageParamTypes';
import { LanguageData } from '../../DataTypes';
import Hoverable from '../../generic/Hoverable';
import { separateTitleAndSubtitle } from '../../utils/stringUtils';

import LanguageCard from './LanguageCard';

type Props = {
  lang: LanguageData;
  format?: 'text' | 'button';
};

const HoverableLanguageName: React.FC<Props> = ({ lang, format = 'text' }) => {
  const { updatePageParams } = usePageParams();
  // Remove parentheses from the name (the contains can be seen in the subtitle of the tooltip)
  const [title] = separateTitleAndSubtitle(lang.nameDisplay);

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
    >
      {format === 'text' ? title : <button>{title}</button>}
    </Hoverable>
  );
};

export default HoverableLanguageName;
