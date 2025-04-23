import React from 'react';

import Hoverable from '../generic/Hoverable';

import ButtonGroupSingleChoice from './ButtonGroupSingleChoice';
import { usePageParams } from './PageParamsContext';
import { DataSubset, Dimension, ViewType } from './PageParamTypes';
import TextInput from './TextInput';

// TODO: needs debouncing on text input
const ControlsBar: React.FC = () => {
  const { dataSubset, viewType, dimension, updatePageParams, code, nameFilter, limit } =
    usePageParams();

  return (
    <div className="controlsBar">
      <div>
        <Hoverable hoverContent={<DimensionSelectorDescription />}>
          <ButtonGroupSingleChoice<Dimension>
            options={Object.values(Dimension)}
            onChange={(dimension: Dimension) =>
              updatePageParams({ dimension, code: '', nameFilter: '' })
            }
            selected={dimension}
          />
        </Hoverable>
        <Hoverable hoverContent="Decide how you want to view the data.">
          <ButtonGroupSingleChoice<ViewType>
            options={Object.values(ViewType)}
            onChange={(viewType: ViewType) =>
              updatePageParams({ viewType, code: '', nameFilter: '' })
            }
            selected={viewType}
          />
        </Hoverable>
        <Hoverable hoverContent='Decide how much data is loaded. "All" will impact page performance.'>
          <ButtonGroupSingleChoice<DataSubset>
            options={Object.values(DataSubset)}
            onChange={(dataSubset: DataSubset) => updatePageParams({ dataSubset })}
            selected={dataSubset}
          />
        </Hoverable>
      </div>
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
    </div>
  );
};

const DimensionSelectorDescription: React.FC = () => {
  return (
    <>
      Decide which dimension you want to view.
      <p>
        <label>Language (Languoid):</label>A verbal communication system used by multiple people.
        Languages should be are mutually intelligible, whereas a dialect is a subset of a language
        defined by differences in lexicon and pronounciation. Since languages families, contested
        languages, and dialects are included it is more precise to consider these
        &quot;Languoids&quot;.
      </p>
      <p>
        <label>Locale:</label>The combination of a language and territory -- used to express how
        many people speak a language in a given area or if a language is officially supported. Some
        locales specific a particular writing system and/or variation information (dialect,
        orthography...).
      </p>
      <p>
        <label>Territory:</label>A geographical unit. Some may not have universal recognition.
        Currently showing both countries as well as dependencies (eg. Hong Kong) that have separate
        ISO codes.
      </p>
      <p>
        <label>Writing System:</label>A system for writing a language to a persistent visual media.
        For instance Latin alphabet, Han characters, cursive Arabic script. Some systems may contain
        other systems.
      </p>
    </>
  );
};

export default ControlsBar;
