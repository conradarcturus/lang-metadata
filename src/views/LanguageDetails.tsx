import React from 'react';
import { LanguageData } from '../dataloading/DataTypes';
import { ViewType } from '../controls/PageParamTypes';
import { usePageParams } from '../controls/PageParamsContext';
import { separateTitleAndSubtitle } from '../utils/stringUtils';
import CommaSeparated from '../components/CommaSeparated';
import './styles.css';
import Hoverable from '../components/Hoverable';
import LanguageCard from './Cards/LanguageCard';

interface Props {
  lang: LanguageData | null;
}

const LanguageDetails: React.FC<Props> = ({ lang }) => {
  const { updatePageParams } = usePageParams();

  if (lang == null) {
    return (
      <div className="Details" style={{ textAlign: 'center' }}>
        No language selected. Enter a language code in the search bar. See common languages:
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 8,
          }}
        >
          {Object.entries({
            eng: 'English',
            spa: 'Spanish',
            fra: 'French',
            deu: 'German',
            zho: 'Chinese',
            ara: 'Arabic',
          }).map(([code, name]) => (
            <button
              key={code}
              onClick={() => updatePageParams({ code, viewType: ViewType.Details })}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const {
    code,
    glottocode,
    medium,
    nameDisplay,
    nameEndonym,
    populationCited,
    script,
    viabilityConfidence,
    viabilityExplanation,
    vitalityEth2013,
    vitalityEth2025,
    parentLanguage,
    childLanguages,
  } = lang;
  const [title, subtitle] = separateTitleAndSubtitle(nameDisplay);

  return (
    <div className="Details">
      <h2>
        <strong>{title}</strong> {title != nameEndonym && nameEndonym}
        {subtitle != null && <div className="subtitle">{subtitle} </div>}
      </h2>
      <div>
        <h3>Attributes</h3>
        <div>
          <label>Language Code:</label>
          {code}
        </div>
        <div>
          <label>Glottocode:</label>
          {glottocode}
        </div>
        <div>
          <label>Population:</label>
          {populationCited.toLocaleString()}
        </div>
        <div>
          <label>Modality:</label>
          {medium}
        </div>
        <div>
          <label>Writing System:</label>
          {script}
        </div>
      </div>
      <div>
        <h3>Vitality & Viability</h3>
        <div>
          <label>Vitality (2013):</label>
          {vitalityEth2013}
        </div>
        <div>
          <label>Vitality (2025):</label>
          {vitalityEth2025}
        </div>
        <div>
          <label>Viability:</label>
          {viabilityConfidence} ... {viabilityExplanation}
        </div>
      </div>
      <div>
        <h3>Connections</h3>
        {parentLanguage != null && (
          <div>
            <label>Group:</label>
            <Hoverable
              hoverContent={<LanguageCard lang={parentLanguage} />}
              onClick={() =>
                updatePageParams({ code: parentLanguage.code, viewType: ViewType.Details })
              }
            >
              {parentLanguage.nameDisplay}
            </Hoverable>
          </div>
        )}
        {childLanguages.length > 0 && (
          <div>
            <label>Includes:</label>
            <CommaSeparated>
              {childLanguages.map((childLanguage) => (
                <Hoverable
                  hoverContent={<LanguageCard lang={childLanguage} />}
                  key={childLanguage.code}
                  onClick={() =>
                    updatePageParams({ code: childLanguage.code, viewType: ViewType.Details })
                  }
                >
                  {childLanguage.nameDisplay}
                </Hoverable>
              ))}
            </CommaSeparated>
          </div>
        )}
        {parentLanguage == null && childLanguages.length === 0 && (
          <div>There is currently no data available to show connections with other languages.</div>
        )}
      </div>
    </div>
  );
};

export default LanguageDetails;
