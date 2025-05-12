import React from 'react';

import { LocaleSeparator } from '../../types/PageParamTypes';
import Selector from '../components/Selector';
import SingleChoiceOptions from '../components/SingleChoiceOptions';
import { usePageParams } from '../PageParamsContext';

const LocaleSeparatorSelector: React.FC = () => {
  const { localeSeparator, updatePageParams } = usePageParams();

  return (
    <Selector
      selectorLabel="Locale Separator:"
      selectorDescription="Choose the separator in locale codes, eg. 'ar-EG' or 'ar_EG'"
    >
      <SingleChoiceOptions<LocaleSeparator>
        options={['_', '-']}
        onChange={(localeSeparator: LocaleSeparator) => updatePageParams({ localeSeparator })}
        selected={localeSeparator}
      />
    </Selector>
  );
};

export default LocaleSeparatorSelector;
