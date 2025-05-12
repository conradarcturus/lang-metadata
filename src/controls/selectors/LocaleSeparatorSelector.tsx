import React from 'react';

import { LocaleSeparator } from '../../types/PageParamTypes';
import { usePageParams } from '../PageParamsContext';
import SingleSelector from '../SingleSelector';

const LocaleSeparatorSelector: React.FC = () => {
  const { localeSeparator, updatePageParams } = usePageParams();

  return (
    <SingleSelector<LocaleSeparator>
      options={['_', '-']}
      onChange={(localeSeparator: LocaleSeparator) => updatePageParams({ localeSeparator })}
      selected={localeSeparator}
      selectorLabel="Locale Separator:"
      selectorDescription="Choose the separator in locale codes, eg. 'ar-EG' or 'ar_EG'"
    />
  );
};

export default LocaleSeparatorSelector;
