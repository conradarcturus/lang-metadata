import React from 'react';
import { LanguageData } from '../dataloading/DataTypes';
import { ViewType } from '../controls/PageParamTypes';
import { usePageParams } from '../controls/PageParamsContext';
import { separateTitleAndSubtitle } from '../utils/stringUtils';

interface Props {
  lang: LanguageData | null;
}

const LanguageDetails: React.FC<Props> = ({ lang }) => {
  if (lang == null) {
    const { updatePageParams } = usePageParams();

    return (
      <div className="Details">
        No language selected. Enter a language code in the search bar. See common languages:
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
    </div>
  );
};

export default LanguageDetails;
