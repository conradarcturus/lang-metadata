import React from 'react';

import { toSentenceCase } from '../../generic/stringUtils';
import { Dimension, ViewType } from '../../types/PageParamTypes';
import { ScopeLevel } from '../../types/ScopeLevel';
import { getDimensionLabelPlural } from '../../views/common/getObjectName';
import MultiSelector from '../MultiSelector';
import { usePageParams } from '../PageParamsContext';

const ScopeFilterSelector: React.FC = () => {
  const { viewType, scopes, updatePageParams, dimension } = usePageParams();
  if ([ViewType.Details].includes(viewType)) {
    return <></>;
  }
  function getOptionDescription(scope: ScopeLevel): string {
    return toSentenceCase(getScopeLevelDescription(dimension, scope, 'long'));
  }
  function getOptionLabel(scope: ScopeLevel): string {
    return toSentenceCase(getScopeLevelDescription(dimension, scope, 'short'));
  }

  return (
    <MultiSelector
      options={Object.values(ScopeLevel)}
      onToggleOption={(scope: ScopeLevel) =>
        scopes.includes(scope)
          ? updatePageParams({ scopes: scopes.filter((s) => s != scope) })
          : updatePageParams({ scopes: [...scopes, scope] })
      }
      selected={scopes}
      selectorLabel="Scope:"
      selectorDescription={`Filter the ${getDimensionLabelPlural(dimension)} shown by the granularity of the code -- eg. grouped objects, individual objects, or parts of objects.`}
      getOptionLabel={getOptionLabel}
      getOptionDescription={getOptionDescription}
    />
  );
};

export function getScopeLevelDescription(
  dimension: Dimension,
  scope: ScopeLevel,
  length: 'long' | 'short',
): string {
  switch (dimension) {
    case Dimension.Language:
      switch (scope) {
        case ScopeLevel.Groups:
          return 'language families';
        case ScopeLevel.Individuals:
          return length === 'long' ? 'languages (including macrolanguages)' : 'languages';
        case ScopeLevel.Parts:
          return 'dialects';
        case ScopeLevel.Other:
          return length === 'long' ? 'special codes or unlabeled languages' : 'special codes';
      }
    // eslint-disable-next-line no-fallthrough
    case Dimension.Locale:
      switch (scope) {
        case ScopeLevel.Groups:
          return 'regional locales';
        case ScopeLevel.Individuals:
          return 'regular locales';
        case ScopeLevel.Parts:
          return length === 'long' ? 'locales with additional variant tags' : 'variant locales';
        case ScopeLevel.Other:
          return length === 'long' ? 'special codes or unlabeled locales' : 'special codes';
      }
    // eslint-disable-next-line no-fallthrough
    case Dimension.Territory:
      switch (scope) {
        case ScopeLevel.Groups:
          return length === 'long' ? 'continents, regions' : 'continents';
        case ScopeLevel.Individuals:
          return 'countries';
        case ScopeLevel.Parts:
          return 'dependencies';
        case ScopeLevel.Other:
          return length === 'long' ? 'special codes or unlabeled territories' : 'special codes';
      }
    // eslint-disable-next-line no-fallthrough
    case Dimension.WritingSystem:
      switch (scope) {
        case ScopeLevel.Groups:
          return length === 'long'
            ? 'script codes that includes multiple scripts'
            : 'script groups';
        case ScopeLevel.Individuals:
          return 'major scripts';
        case ScopeLevel.Parts:
          return 'script variations';
        case ScopeLevel.Other:
          return 'special codes';
      }
  }
}

export default ScopeFilterSelector;
