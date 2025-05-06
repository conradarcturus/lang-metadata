import Hoverable from '../generic/Hoverable';
import { TABLE_MAX_ROWS } from '../views/common/table/ObjectTable';

import ButtonGroupSingleChoice from './ButtonGroupSingleChoice';
import { usePageParams } from './PageParamsContext';
import { SortBy, ViewType } from './PageParamTypes';
import TextInput from './TextInput';

const FilterControls: React.FC = () => {
  const { viewType, dimension, codeFilter, updatePageParams, nameFilter, limit, sortBy } =
    usePageParams();

  return (
    <div>
      {[ViewType.CardList, ViewType.Hierarchy, ViewType.Table, ViewType.Details].includes(
        viewType,
      ) && (
        <Hoverable
          hoverContent={
            viewType == ViewType.CardList
              ? `Filter the ${dimension.toLowerCase()} by its ${dimension.toLowerCase()} code.`
              : `Pick a ${dimension.toLowerCase()} to view.`
          }
        >
          <TextInput
            label="Code:"
            value={codeFilter}
            onChange={(codeFilter: string) => updatePageParams({ codeFilter })}
            inputStyle={{ width: '3em' }}
            placeholder="filter by"
          />
        </Hoverable>
      )}
      {[ViewType.CardList, ViewType.Hierarchy, ViewType.Table, ViewType.Warnings].includes(
        viewType,
      ) && (
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
      {[ViewType.CardList, ViewType.Hierarchy, ViewType.Table].includes(viewType) && (
        <Hoverable
          hoverContent={`Limit how many ${dimension.toLowerCase()} ${getLimitableObjectName(viewType)} are shown.`}
        >
          <TextInput
            label="Limit:"
            value={limit < 1 || Number.isNaN(limit) ? '' : limit.toString()}
            onChange={(limit: string) => updatePageParams({ limit: parseInt(limit) })}
            inputStyle={{ width: '3em' }}
            placeholder={viewType === ViewType.Table ? TABLE_MAX_ROWS.toString() : '∞'}
          />
        </Hoverable>
      )}
      {viewType != ViewType.Table && (
        <Hoverable hoverContent={`Choose the order of items in the view.`}>
          <ButtonGroupSingleChoice<SortBy>
            options={Object.values(SortBy)}
            onChange={(sortBy: SortBy) => updatePageParams({ sortBy })}
            selected={sortBy}
            groupLabel="Sort by:"
          />
        </Hoverable>
      )}
    </div>
  );
};

function getLimitableObjectName(viewType: ViewType) {
  switch (viewType) {
    case ViewType.CardList:
      return 'cards';
    case ViewType.Hierarchy:
      return 'root nodes';
    case ViewType.Details:
      return '???';
    case ViewType.Table:
      return 'rows';
    case ViewType.Warnings:
      return 'warnings';
  }
}

export default FilterControls;
