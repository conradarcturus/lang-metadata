import React from 'react';

import { Dimension } from '../../types/PageParamTypes';
import Selector from '../components/Selector';
import SingleChoiceOptions from '../components/SingleChoiceOptions';
import { usePageParams } from '../PageParamsContext';

const DimensionSelector: React.FC = () => {
  const { dimension, updatePageParams } = usePageParams();

  return (
    <Selector>
      <SingleChoiceOptions<Dimension>
        options={Object.values(Dimension)}
        onChange={(dimension: Dimension) => updatePageParams({ dimension })}
        mode="flat"
        selected={dimension}
        getOptionDescription={(dimension) => (
          <>
            <div style={{ marginBottom: 8 }}>Decide which kind of object you want to view.</div>
            <OptionDescription dimension={dimension} />
          </>
        )}
      />
    </Selector>
  );
};

const OptionDescription: React.FC<{ dimension: Dimension }> = ({ dimension }) => {
  switch (dimension) {
    case Dimension.Language:
      return (
        <>
          <label>Language (Languoid):</label>A verbal communication system used by multiple people.
          Languages should be are mutually intelligible, whereas a dialect is a subset of a language
          defined by differences in lexicon and pronounciation. Since languages families, contested
          languages, and dialects are included it is more precise to consider these
          &quot;Languoids&quot;.
        </>
      );
    case Dimension.Locale:
      return (
        <>
          <label>Locale:</label>The combination of a language and territory -- used to express how
          many people speak a language in a given area or if a language is officially supported.
          Some locales specific a particular writing system and/or variation information (dialect,
          orthography...).
        </>
      );
    case Dimension.Territory:
      return (
        <>
          <label>Territory:</label>A geographical unit. Some may not have universal recognition.
          Currently showing both countries as well as dependencies (eg. Hong Kong) that have
          separate ISO codes.
        </>
      );
    case Dimension.WritingSystem:
      return (
        <>
          <label>Writing System:</label>A system for writing a language to a persistent visual
          media. For instance Latin alphabet, Han characters, cursive Arabic script. Some systems
          may contain other systems.
        </>
      );
  }
};

export default DimensionSelector;
