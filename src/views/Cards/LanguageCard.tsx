import React from 'react';
import { LanguageData } from '../../dataloading/DataTypes';

interface Props {
  lang: LanguageData;
}

const LanguageCard: React.FC<Props> = ({ lang }) => {
  const { vitalityEth2013, medium, populationCited, nameDisplay, nameEndonym } = lang;

  return (
    <div className="LanguageCard">
      <h3>
        <strong>{nameDisplay}</strong> {nameDisplay != nameEndonym && nameEndonym}
      </h3>
      <div>
        <h4>Speakers</h4>
        {populationCited.toLocaleString()}
      </div>
      <div>
        <h4>Modality</h4>
        {medium}
      </div>
      <div>
        <h4>Vitality</h4>
        {vitalityEth2013}
      </div>
    </div>
  );
};

export default LanguageCard;
