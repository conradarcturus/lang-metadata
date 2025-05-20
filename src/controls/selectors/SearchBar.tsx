import React from 'react';

import { SearchableField, View } from '../../types/PageParamTypes';
import Selector from '../components/Selector';
import SingleChoiceOptions from '../components/SingleChoiceOptions';
import TextInput from '../components/TextInput';
import { usePageParams } from '../PageParamsContext';

import { useSearchSuggestions } from './useSearchSuggestions';

const SearchBar: React.FC = () => {
  const { searchBy, searchString, updatePageParams, view } = usePageParams();
  const getSearchSuggestions = useSearchSuggestions();

  return (
    <Selector className="SearchBar" selectorLabel="🔎">
      <TextInput
        inputStyle={{ minWidth: '20em' }}
        getSuggestions={getSearchSuggestions}
        onChange={(searchString: string) => updatePageParams({ searchString })}
        placeholder="search"
        showFilterButton={view !== View.Details}
        showGoToDetailsButton={true}
        value={searchString}
      />
      <label className="NoLeftBorder">on</label>
      <SingleChoiceOptions<SearchableField>
        onChange={(searchBy: SearchableField) => updatePageParams({ searchBy })}
        options={Object.values(SearchableField)}
        selected={searchBy}
      />
    </Selector>
  );
};

export default SearchBar;
