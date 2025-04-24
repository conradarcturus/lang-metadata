import Hoverable from '../generic/Hoverable';

import { usePageParams } from './PageParamsContext';
import { ViewType } from './PageParamTypes';
import TextInput from './TextInput';

const FilterControls: React.FC = () => {
  const { viewType, dimension, code, updatePageParams, nameFilter, limit } = usePageParams();

  return (
    <div>
      <Hoverable
        hoverContent={
          viewType == ViewType.CardList
            ? `Filter the ${dimension.toLowerCase()} by its ${dimension.toLowerCase()} code.`
            : `Pick a ${dimension.toLowerCase()} to view.`
        }
      >
        <TextInput
          label="Code"
          value={code}
          onChange={(code: string) => updatePageParams({ code })}
          inputStyle={{ width: '3em' }}
        />
      </Hoverable>
      {viewType === ViewType.CardList && (
        <Hoverable
          hoverContent={`Filter the ${dimension.toLowerCase()} by its name. Caution: if you have too many items visible then this may jitter, so type slowly.`}
        >
          <TextInput
            label="Name"
            value={nameFilter}
            onChange={(nameFilter: string) => updatePageParams({ nameFilter })}
            inputStyle={{ width: '10em' }}
          />
        </Hoverable>
      )}
      {viewType === ViewType.CardList && (
        <Hoverable hoverContent={`Limit how many ${dimension.toLowerCase()} cards are shown.`}>
          <TextInput
            label="Limit"
            value={limit < 1 || Number.isNaN(limit) ? '' : limit.toString()}
            onChange={(limit: string) => updatePageParams({ limit: parseInt(limit) })}
            inputStyle={{ width: '3em' }}
          />
        </Hoverable>
      )}
    </div>
  );
};

export default FilterControls;
