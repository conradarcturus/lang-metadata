import React, { useState } from 'react';

import { usePageParams } from '../controls/PageParamsContext';
import { LanguageSchema } from '../controls/PageParamTypes';
import { getSortFunction } from '../controls/sort';
import { useDataContext } from '../dataloading/DataContext';
import { LanguageData } from '../DataTypes';

import TreeListRoot from './common/TreeList/TreeListRoot';
import { getLanguageTreeNodes } from './language/LanguageHierarchy';
import ViewCard from './ViewCard';

/**
 * A page that shows tips about problems in the data that may need to be addressed
 */
const ViewWarnings: React.FC = () => {
  return (
    <>
      {' '}
      <LanguagesWithIdenticalNames />
    </>
  );
};

const LanguagesWithIdenticalNames: React.FC = () => {
  const {
    languagesBySchema: { Inclusive },
  } = useDataContext();
  const { nameFilter } = usePageParams();
  const lowercaseNameFilter = nameFilter.toLowerCase();
  const sortFunction = getSortFunction();
  const languagesByName = Object.values(Inclusive).reduce<Record<string, LanguageData[]>>(
    (languagesByName, lang) => {
      const name = lang.nameDisplay + (lang.nameSubtitle ?? '');
      if (name.toLowerCase().includes(lowercaseNameFilter)) {
        if (languagesByName[name] == null) {
          languagesByName[name] = [lang];
        } else {
          languagesByName[name].push(lang);
        }
      }
      return languagesByName;
    },
    {},
  );
  const duplicatedNamesISOMismatch = Object.entries(languagesByName).reduce<
    Record<string, Partial<Record<LanguageSchema, LanguageData[]>>>
  >((duplicatedNames, [name, langs]) => {
    if (langs.length > 1 && name !== '0') {
      // Some are repeat names -- let's just find pairs where they are missing glottocode and iso codes
      const isoOnly = langs.filter((lang) => lang.schemaSpecific.Glottolog.code == null);
      const glottoOnly = langs.filter((lang) => lang.schemaSpecific.ISO.code == null);
      const hasBoth = langs.filter(
        (lang) =>
          lang.schemaSpecific.ISO.code != null && lang.schemaSpecific.Glottolog.code != null,
      );

      if (isoOnly.length > 0 && glottoOnly.length > 0 && hasBoth.length === 0) {
        duplicatedNames[name] = {
          [LanguageSchema.Glottolog]: glottoOnly,
          [LanguageSchema.ISO]: isoOnly,
        };
      }
    }
    return duplicatedNames;
  }, {});
  const otherLangsWithDupNames = Object.entries(languagesByName).reduce<
    Record<string, LanguageData[]>
  >((duplicatedNames, [name, langs]) => {
    if (langs.length > 1 && duplicatedNamesISOMismatch[name] == null && name !== '0') {
      duplicatedNames[name] = langs;
    }
    return duplicatedNames;
  }, {});

  const [showduplicatedNamesISOMismatch, setShowduplicatedNamesISOMismatch] = useState(false);
  const [showotherLangsWithDupNames, setShowotherLangsWithDupNames] = useState(false);

  return (
    <div>
      <div>
        <span style={{ fontSize: '1.5em' }}>
          Languages with Identical names & ISO/Glottolog mismatch
        </span>{' '}
        <button
          style={{ padding: 6 }}
          onClick={() => setShowduplicatedNamesISOMismatch((prev) => !prev)}
        >
          {showduplicatedNamesISOMismatch ? `▼` : `▶`} Show{' '}
          {Object.keys(duplicatedNamesISOMismatch).length}
        </button>
      </div>
      <div>
        {showduplicatedNamesISOMismatch &&
          Object.entries(duplicatedNamesISOMismatch)
            .sort((a, b) => {
              const aISO = a[1].ISO;
              const bISO = b[1].ISO;
              return aISO != null && aISO[0] != null && bISO != null && bISO[0] != null
                ? sortFunction(aISO[0], bISO[0])
                : 0;
            })
            .map(([name, { ISO: ISOonly = [], Glottolog: GlottologOnly = [] }]) => {
              return (
                <div key={name} style={{ textAlign: 'start' }}>
                  <h3>{name}</h3>
                  <div className="CardList">
                    {ISOonly.map((lang) => {
                      const { ISO } = lang.schemaSpecific;
                      return (
                        <ViewCard key={lang.code}>
                          {lang.nameDisplay}
                          <div>
                            <label>ISO code:</label>
                            {ISO.code}
                          </div>
                          <div>
                            <label>Scope:</label>
                            {ISO.scope ?? <em>Unknown</em>}
                          </div>
                          <div>
                            <TreeListRoot
                              rootNodes={getLanguageTreeNodes(
                                [lang],
                                LanguageSchema.ISO,
                                sortFunction,
                              )}
                            />
                          </div>
                        </ViewCard>
                      );
                    })}
                    {GlottologOnly.map((lang) => {
                      const { Glottolog } = lang.schemaSpecific;
                      return (
                        <ViewCard key={lang.code}>
                          {lang.nameDisplay}
                          <div>
                            <label>Glottocode:</label>
                            {Glottolog.code}
                          </div>
                          <div>
                            <label>Scope:</label>
                            {Glottolog.scope ?? <em>Unknown</em>}
                          </div>
                          <div>
                            <TreeListRoot
                              rootNodes={getLanguageTreeNodes(
                                [lang],
                                LanguageSchema.Glottolog,
                                sortFunction,
                              )}
                            />
                          </div>
                        </ViewCard>
                      );
                    })}
                  </div>
                </div>
              );
            })}
      </div>
      <div>
        <span style={{ fontSize: '1.5em' }}>Other Languages with Identical names</span>{' '}
        <button
          style={{ padding: 6 }}
          onClick={() => setShowotherLangsWithDupNames((prev) => !prev)}
        >
          {showotherLangsWithDupNames ? `▼` : `▶`} Show{' '}
          {Object.keys(otherLangsWithDupNames).length}
        </button>
      </div>
      <div>
        {showotherLangsWithDupNames &&
          Object.entries(otherLangsWithDupNames)
            .sort((a, b) => {
              const aData = a[1][0];
              const bData = b[1][0];
              return aData != null && bData != null ? sortFunction(aData, bData) : 0;
            })
            .map(([name, langs]) => (
              <div key={name} style={{ textAlign: 'start' }}>
                <h3>{name}</h3>
                <div className="CardList">
                  {langs.map((lang) => {
                    const { ISO, Glottolog } = lang.schemaSpecific;
                    return (
                      <ViewCard key={lang.code}>
                        {lang.nameDisplay}
                        <div>
                          <label>ISO code:</label>
                          {ISO.code}
                        </div>
                        <div>
                          <label>Glottocode:</label>
                          {Glottolog.code}
                        </div>
                        <div>
                          <label>Scope:</label>
                          {lang.scope ?? <em>Unknown</em>}
                        </div>
                        {ISO.code != null && (
                          <div>
                            ISO Hierarchy:{' '}
                            <TreeListRoot
                              rootNodes={getLanguageTreeNodes(
                                [lang],
                                LanguageSchema.ISO,
                                sortFunction,
                              )}
                            />
                          </div>
                        )}
                        {Glottolog.code != null && (
                          <div>
                            Glottolog Hierarchy:{' '}
                            <TreeListRoot
                              rootNodes={getLanguageTreeNodes(
                                [lang],
                                LanguageSchema.Glottolog,
                                sortFunction,
                              )}
                            />
                          </div>
                        )}
                      </ViewCard>
                    );
                  })}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ViewWarnings;
