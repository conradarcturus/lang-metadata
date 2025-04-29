import React from 'react';

import Hoverable from '../generic/Hoverable';

import ButtonGroupSingleChoice from './ButtonGroupSingleChoice';
import FilterControls from './FilterControls';
import { usePageParams } from './PageParamsContext';
import { DataSubset, Dimension, ViewType } from './PageParamTypes';

// TODO: needs debouncing on text input
const ControlsBar: React.FC = () => {
  const { dataSubset, viewType, dimension, updatePageParams } = usePageParams();

  return (
    <div className="controlsBar">
      <div>
        <Hoverable hoverContent={<DimensionSelectorDescription />}>
          <ButtonGroupSingleChoice<Dimension>
            options={Object.values(Dimension)}
            onChange={(dimension: Dimension) =>
              updatePageParams({ dimension, codeFilter: '', nameFilter: '' })
            }
            selected={dimension}
          />
        </Hoverable>
        <Hoverable hoverContent="Decide how you want to view the data.">
          <ButtonGroupSingleChoice<ViewType>
            options={[ViewType.CardList, ViewType.Hierarchy]}
            onChange={(viewType: ViewType) => updatePageParams({ viewType })}
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
      <FilterControls />
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
