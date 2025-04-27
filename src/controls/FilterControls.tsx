import Hoverable from '../generic/Hoverable';

import ButtonGroupSingleChoice from './ButtonGroupSingleChoice';
import { usePageParams } from './PageParamsContext';
import { SortBy, ViewType } from './PageParamTypes';
import TextInput from './TextInput';

const FilterControls: React.FC = () => {
  const { viewType, dimension, code, updatePageParams, nameFilter, limit, sortBy } =
    usePageParams();

  return (
    <div>
      {[ViewType.CardList, ViewType.Details].includes(viewType) && (
        <Hoverable
          hoverContent={
            viewType == ViewType.CardList
              ? `Filter the ${dimension.toLowerCase()} by its ${dimension.toLowerCase()} code.`
              : `Pick a ${dimension.toLowerCase()} to view.`
          }
        >
          <TextInput
            label="Code:"
            value={code}
            onChange={(code: string) => updatePageParams({ code })}
            inputStyle={{ width: '3em' }}
            placeholder="filter by"
          />
        </Hoverable>
      )}
      {viewType === ViewType.CardList && (
        <Hoverable
          hoverContent={`Filter the ${dimension.toLowerCase()} by its name. Caution: if you have too many items visible then this may jitter, so type slowly.`}
        >
          <TextInput
            label="Name:"
            value={nameFilter}
            onChange={(nameFilter: string) => updatePageParams({ nameFilter })}
            inputStyle={{ width: '10em' }}
            placeholder="filter by"
          />
        </Hoverable>
      )}
      {[ViewType.CardList, ViewType.Hierarchy].includes(viewType) && (
        <Hoverable
          hoverContent={`Limit how many ${dimension.toLowerCase()} ${viewType === ViewType.CardList ? 'cards' : 'root nodes'} are shown.`}
        >
          <TextInput
            label="Limit:"
            value={limit < 1 || Number.isNaN(limit) ? '' : limit.toString()}
            onChange={(limit: string) => updatePageParams({ limit: parseInt(limit) })}
            inputStyle={{ width: '3em' }}
            placeholder="&infin;"
          />
        </Hoverable>
      )}
      {
        <Hoverable hoverContent={`Choose the order of items in the view.`}>
          <ButtonGroupSingleChoice<SortBy>
            options={Object.values(SortBy)}
            onChange={(sortBy: SortBy) => updatePageParams({ sortBy })}
            selected={sortBy}
            groupLabel="Sort by:"
          />
        </Hoverable>
      }
    </div>
  );
};

export default FilterControls;
