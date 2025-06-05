import React from 'react';

import { usePageParams } from '../../controls/PageParamsContext';
import { getSortFunction } from '../../controls/sort';
import CommaSeparated from '../../generic/CommaSeparated';
import Hoverable from '../../generic/Hoverable';
import { CLDRCoverageLevel } from '../../types/CLDRTypes';
import { LanguageData, LanguageScope } from '../../types/LanguageTypes';
import HoverableObjectName from '../common/HoverableObjectName';
import TreeListRoot from '../common/TreeList/TreeListRoot';
import { getLocaleTreeNodes } from '../locale/LocaleHierarchy';

import { getLanguageTreeNodes } from './LanguageHierarchy';

type Props = {
  lang: LanguageData;
};

const LanguageDetails: React.FC<Props> = ({ lang }) => {
  const { languageSchema } = usePageParams();
  const sortFunction = getSortFunction();
  const {
    codeISO6391,
    childLanguages,
    medium,
    nameDisplay,
    populationCited,
    primaryWritingSystem,
    schemaSpecific,
    vitalityEth2013,
    vitalityEth2025,
    vitalityISO,
    writingSystems,
  } = lang;
  const { Glottolog, ISO, CLDR } = schemaSpecific;

  const otherNames = Object.values(schemaSpecific).reduce<string[]>((otherNames, { name }) => {
    if (name && nameDisplay !== name && !otherNames.includes(name)) {
      otherNames.push(name);
    }
    return otherNames;
  }, []);

  return (
    <div className="Details">
      <div className="section">
        <h3>Identification</h3>
        {otherNames.length > 0 && (
          <div>
            <label>Other names:</label>
            {otherNames.join(', ')}
          </div>
        )}
        <div>
          <label>Language Code:</label>
          {lang.ID}
        </div>
        <div>
          <label>Glottocode:</label>
          {Glottolog.code ? (
            <>
              {Glottolog.code}
              <a href={`https://glottolog.org/resource/languoid/id/${Glottolog.code}`}>
                <button className="LinkButton" role="link">
                  Glottolog
                </button>
              </a>
            </>
          ) : (
            <span className="unsupported">Not in Glottolog</span>
          )}
        </div>
        <div>
          <label>ISO Code:</label>
          {ISO.code ? (
            <>
              {ISO.code}
              {codeISO6391 ? ` | ${codeISO6391}` : ''}
              <a href={`https://iso639-3.sil.org/code/${ISO.code}`}>
                <button className="LinkButton" role="link">
                  ISO Table
                </button>
              </a>
            </>
          ) : (
            <span className="unsupported">Not in ISO catalog</span>
          )}
        </div>
        <div>
          <label>CLDR Code:</label>
          {CLDR.code ? (
            <>
              {CLDR.code}
              <a
                href={`https://github.com/unicode-org/cldr/blob/main/common/main/${CLDR.code}.xml`}
              >
                <button className="LinkButton" role="link">
                  CLDR XML
                </button>
              </a>
            </>
          ) : (
            <span className="unsupported">Not in CLDR</span>
          )}
        </div>
        {ISO.code && (
          <div>
            <label>Other external links:</label>
            <a href={`https://www.ethnologue.com/language/${ISO.code}`}>
              <button className="LinkButton" role="link">
                Ethnologue
              </button>
            </a>
            <a href={`https://en.wikipedia.org/wiki/ISO_639:${ISO.code}`}>
              <button className="LinkButton" role="link">
                Wikipedia
              </button>
            </a>
          </div>
        )}
      </div>
      <div className="section">
        <h3>Attributes</h3>
        {populationCited && (
          <div>
            <label>Population:</label>
            {populationCited.toLocaleString()}
          </div>
        )}
        {medium && (
          <div>
            <label>Modality:</label>
            {medium}
          </div>
        )}
        {primaryWritingSystem && (
          <div>
            <label>Primary Writing System:</label>
            <HoverableObjectName object={primaryWritingSystem} />
          </div>
        )}
        {Object.values(writingSystems).length > 0 && (
          <div>
            <label>Writing Systems:</label>
            <CommaSeparated>
              {Object.values(writingSystems)
                .sort(sortFunction)
                .map((writingSystem) => (
                  <HoverableObjectName key={writingSystem.ID} object={writingSystem} />
                ))}
            </CommaSeparated>
          </div>
        )}
      </div>
      <div className="section">
        <h3>Vitality & Viability</h3>
        {vitalityISO && (
          <div>
            <label>ISO Vitality / Status:</label>
            {vitalityISO}
          </div>
        )}
        {vitalityEth2013 && (
          <div>
            <label>Ethnologue Vitality (2013):</label>
            {vitalityEth2013}
          </div>
        )}
        {vitalityEth2025 && (
          <div>
            <label>Ethnologue Vitality (2025):</label>
            {vitalityEth2025}
          </div>
        )}
        <div>
          <label>Should use in World Atlas:</label>
          {lang.viabilityConfidence} ... {lang.viabilityExplanation}
        </div>
        <div>
          <label>Internet Technologies:</label>
          <CLDRCoverageInfo lang={lang} />
        </div>
      </div>
      <div className="section">
        <h3>Connections</h3>
        {ISO.parentLanguage && (
          <div>
            <label>ISO group:</label>
            <HoverableObjectName object={ISO.parentLanguage} />
          </div>
        )}
        {Glottolog.parentLanguage && (
          <div>
            <label>Glottolog group:</label>
            <HoverableObjectName object={Glottolog.parentLanguage} />
          </div>
        )}
        <div style={{ display: 'flex' }}>
          <div>
            <label>Descendent Languages:</label>
            {childLanguages.length > 0 ? (
              <TreeListRoot
                rootNodes={getLanguageTreeNodes([lang], languageSchema, sortFunction)}
              />
            ) : (
              <div>
                <span className="unsupported">No languages come from this language.</span>
              </div>
            )}
          </div>
          <div>
            <label>Locales:</label>
            {lang.locales.length > 0 ? (
              <TreeListRoot rootNodes={getLocaleTreeNodes([lang], sortFunction)} />
            ) : (
              <div>
                <span className="unsupported">
                  There are no recorded locales for this language.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CLDRCoverageInfo: React.FC<{ lang: LanguageData }> = ({ lang }) => {
  const {
    cldrCoverage,
    schemaSpecific: { CLDR },
  } = lang;
  if (cldrCoverage == null) {
    if (
      CLDR.parentLanguage != null &&
      CLDR.parentLanguage.cldrCoverage != null &&
      CLDR.scope === LanguageScope.Macrolanguage
    ) {
      return (
        <Hoverable
          hoverContent={
            <div>
              {lang.nameCanonical} [{CLDR.code}] is not directly supported since it is a
              macrolanguage. Rather it is supported with data from its constituent language:{' '}
              {CLDR.parentLanguage.nameCanonical} [
              {CLDR.parentLanguage.schemaSpecific.CLDR.code ?? CLDR.parentLanguage.codeDisplay}]
            </div>
          }
          style={{ textDecoration: 'none', cursor: 'help' }}
        >
          ⚠️ <CLDRCoverageInfo lang={CLDR.parentLanguage} />
        </Hoverable>
      );
    }
    return <span className="unsupported">Not supported by CLDR or ICU.</span>;
  }

  return (
    <>
      CLDR:{' '}
      <span style={{ color: getCLDRCoverageColor(cldrCoverage.actualCoverageLevel) }}>
        {cldrCoverage.actualCoverageLevel}
      </span>{' '}
      coverage by {cldrCoverage.countOfCLDRLocales} locale
      {cldrCoverage.countOfCLDRLocales > 1 && 's'}. ICU: {cldrCoverage.inICU ? '✅' : '❌'}
    </>
  );
};

function getCLDRCoverageColor(coverageLevel: CLDRCoverageLevel): string {
  switch (coverageLevel) {
    case CLDRCoverageLevel.Core:
      return 'var(--color-text-secondary)';
    case CLDRCoverageLevel.Basic:
      return 'var(--color-text-yellow)';
    case CLDRCoverageLevel.Moderate:
      return 'var(--color-text-green)';
    case CLDRCoverageLevel.Modern:
      return 'var(--color-text-blue)';
  }
}

export default LanguageDetails;
