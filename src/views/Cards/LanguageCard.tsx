import React from 'react';
import { LanguageData } from '../../dataloading/DataTypes';
import { ViewType } from '../../controls/PageParamTypes';
import { separateTitleAndSubtitle } from '../../utils/stringUtils';
import { usePageParams } from '../../controls/PageParamsContext';
import CommaSeparated from '../../components/CommaSeparated';
import Hoverable from '../../components/Hoverable';

interface Props {
  lang: LanguageData;
  includeRelations?: boolean;
}

const LanguageCard: React.FC<Props> = ({ lang, includeRelations }) => {
  const { updatePageParams } = usePageParams();
  const {
    vitalityEth2013,
    medium,
    populationCited,
    nameDisplay,
    nameEndonym,
    parentLanguage,
    childLanguages,
  } = lang;
  const [title, subtitle] = separateTitleAndSubtitle(nameDisplay);

  return (
    <div>
      <h3>
        <a onClick={() => updatePageParams({ code: lang.code, viewType: ViewType.Details })}>
          <strong>{title}</strong> {title != nameEndonym && nameEndonym}
        </a>
        {subtitle != null && <div className="subtitle">{subtitle} </div>}
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

      {includeRelations && parentLanguage != null && (
        <div>
          <h4>Group:</h4>
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
      {includeRelations && Object.keys(childLanguages).length > 0 && (
        <div>
          <h4>Includes:</h4>
          <CommaSeparated>
            {Object.values(childLanguages).map((childLanguage) => (
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
    </div>
  );
};

export default LanguageCard;
