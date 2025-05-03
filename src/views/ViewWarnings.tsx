import React, { useState } from 'react';

import { LanguageSchema } from '../controls/PageParamTypes';
import { useDataContext } from '../dataloading/DataContext';
import { LanguageData } from '../DataTypes';

import TreeListRoot from './TreeListRoot';
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
  const languagesByName = Object.values(Inclusive).reduce<Record<string, LanguageData[]>>(
    (languagesByName, lang) => {
      const name = lang.nameDisplay + (lang.nameDisplaySubtitle ?? '');
      // const name = lang.scope + ': ' + lang.nameDisplay + (lang.nameDisplaySubtitle ?? '');
      if (languagesByName[name] == null) {
        languagesByName[name] = [lang];
      } else {
        languagesByName[name].push(lang);
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
          Object.entries(duplicatedNamesISOMismatch).map(
            ([name, { ISO: ISOonly = [], Glottolog: GlottologOnly = [] }]) => {
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
                            <TreeListRoot rootNodes={[lang]} languageSchema={LanguageSchema.ISO} />
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
                              rootNodes={[lang]}
                              languageSchema={LanguageSchema.Glottolog}
                            />
                          </div>
                        </ViewCard>
                      );
                    })}
                  </div>
                </div>
              );
            },
          )}
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
          Object.entries(otherLangsWithDupNames).map(([name, langs]) => {
            return (
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
                            <TreeListRoot rootNodes={[lang]} languageSchema={LanguageSchema.ISO} />
                          </div>
                        )}
                        {Glottolog.code != null && (
                          <div>
                            Glottolog Hierarchy:{' '}
                            <TreeListRoot
                              rootNodes={[lang]}
                              languageSchema={LanguageSchema.Glottolog}
                            />
                          </div>
                        )}
                      </ViewCard>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ViewWarnings;
