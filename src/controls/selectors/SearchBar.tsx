import React from 'react';

import { SearchBy, ViewType } from '../../types/PageParamTypes';
import Selector from '../components/Selector';
import SingleChoiceOptions from '../components/SingleChoiceOptions';
import TextInput from '../components/TextInput';
import { usePageParams } from '../PageParamsContext';

const SearchBar: React.FC = () => {
  const { searchBy, searchString, updatePageParams, viewType } = usePageParams();

  if (viewType === ViewType.Details) {
    // Not supported for this view
    return <></>;
  }

  return (
    <Selector selectorLabel="🔎">
      <TextInput
        inputStyle={{ width: 'fit-content', minWidth: '2em' }}
        onChange={(searchString: string) => updatePageParams({ searchString })}
        placeholder="search"
        value={searchString}
      />
      <label className="NoLeftBorder">on</label>
      <SingleChoiceOptions<SearchBy>
        onChange={(searchBy: SearchBy) => updatePageParams({ searchBy })}
        options={Object.values(SearchBy)}
        selected={searchBy}
      />
    </Selector>
  );
};

export default SearchBar;
