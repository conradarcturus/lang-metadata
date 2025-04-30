import React, { useEffect } from 'react';

import { usePageParams } from '../controls/PageParamsContext';
import { ViewType } from '../controls/PageParamTypes';
import { useDataContext } from '../dataloading/DataContext';
import Hoverable from '../generic/Hoverable';

import './modal.css';

import LanguageDetails from './language/LanguageDetails';
import LocaleDetails from './locale/LocaleDetails';
import ObjectTitle from './ObjectTitle';
import TerritoryDetails from './territory/TerritoryDetails';
import WritingSystemDetails from './writingsystem/WritingSystemDetails';

const ViewModal: React.FC = () => {
  const { modalObject, updatePageParams } = usePageParams();
  const { languagesByCode, territoriesByCode, writingSystems, locales } = useDataContext();
  const onClose = () => updatePageParams({ modalObject: undefined });

  useEffect(() => {
    // TODO there is a problem with this changing the page parameters beyond the modal object
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (modalObject == null) {
    return <></>;
  }

  let object = null;
  let modalContents = null;
  if (languagesByCode[modalObject] != null) {
    object = languagesByCode[modalObject];
    modalContents = <LanguageDetails lang={object} />;
  } else if (territoriesByCode[modalObject] != null) {
    object = territoriesByCode[modalObject];
    modalContents = <TerritoryDetails territory={object} />;
  } else if (locales[modalObject] != null) {
    object = locales[modalObject];
    modalContents = <LocaleDetails locale={object} />;
  } else if (writingSystems[modalObject] != null) {
    object = writingSystems[modalObject];
    modalContents = <WritingSystemDetails writingSystem={object} />;
  }

  if (object == null || modalContents == null) {
    return <></>;
  }

  return (
    <div className="ModalOverlay">
      {/* onClick={(e) => e.target === e.currentTarget && onClose()} */}
      <div className="Modal" aria-modal="true" role="dialog">
        <div className="ModalHeader">
          <div className="ModalTitle">
            <ObjectTitle object={object} />
          </div>
          <div className="ModalButtons">
            <Hoverable hoverContent="Expand modal to page">
              <button
                onClick={() =>
                  updatePageParams({
                    modalObject: undefined,
                    codeFilter: object.code,
                    dimension: object.type,
                    viewType: ViewType.Details,
                  })
                }
              >
                &#x2197;
              </button>
            </Hoverable>
            <Hoverable hoverContent="Close modal">
              <button onClick={onClose}>&#x2716;</button>
            </Hoverable>
          </div>
        </div>
        <div className="ModalBody">{modalContents}</div>
      </div>
    </div>
  );
};

export default ViewModal;
