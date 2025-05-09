import React from 'react';

import { toTitleCase } from '../../generic/stringUtils';
import { Dimension, ViewType } from '../../types/PageParamTypes';
import { ScopeLevel } from '../../types/ScopeLevel';
import MultiSelector from '../MultiSelector';
import { usePageParams } from '../PageParamsContext';

const ScopeFilterSelector: React.FC = () => {
  const { viewType, scopes, updatePageParams, dimension } = usePageParams();
  if ([ViewType.Details].includes(viewType)) {
    return <></>;
  }
  if ([Dimension.Locale].includes(dimension)) {
    // Not well defined yet for locales
    return <></>;
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
      groupLabel="Scope:"
      getOptionDescription={(scope) => toTitleCase(getScopeLevelDescription(dimension, scope))}
    />
  );
};

export function getScopeLevelDescription(dimension: Dimension, scope: ScopeLevel): string {
  switch (dimension) {
    case Dimension.Language:
      switch (scope) {
        case ScopeLevel.Groups:
          return 'language families';
        case ScopeLevel.Individuals:
          return 'languages (including macrolanguages)';
        case ScopeLevel.Parts:
          return 'dialects';
        case ScopeLevel.Other:
          return 'special codes or unlabeled languages';
      }
    // eslint-disable-next-line no-fallthrough
    case Dimension.Locale:
      switch (scope) {
        case ScopeLevel.Groups:
          return '';
        case ScopeLevel.Individuals:
          return 'regular locales';
        case ScopeLevel.Parts:
          return 'locales with additional variant tags';
        case ScopeLevel.Other:
          return 'special codes or unlabeled locales';
      }
    // eslint-disable-next-line no-fallthrough
    case Dimension.Territory:
      switch (scope) {
        case ScopeLevel.Groups:
          return 'continents, regions';
        case ScopeLevel.Individuals:
          return 'countries';
        case ScopeLevel.Parts:
          return 'dependencies';
        case ScopeLevel.Other:
          return 'special codes or unlabeled territories';
      }
    // eslint-disable-next-line no-fallthrough
    case Dimension.WritingSystem:
      switch (scope) {
        case ScopeLevel.Groups:
          return 'code with multiple co-existing scripts';
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
