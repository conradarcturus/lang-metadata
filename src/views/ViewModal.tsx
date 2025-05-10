import React, { useEffect } from 'react';

import { usePageParams } from '../controls/PageParamsContext';
import Hoverable from '../generic/Hoverable';
import { ViewType } from '../types/PageParamTypes';

import './modal.css';

import ObjectDetails, { getObjectFromID } from './common/ObjectDetails';
import ObjectTitle from './common/ObjectTitle';

const ViewModal: React.FC = () => {
  const { objectID, viewType, updatePageParams } = usePageParams();
  const onClose = () => updatePageParams({ objectID: undefined });

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

  if (objectID == null || viewType === ViewType.Details) {
    return <></>;
  }
  const object = getObjectFromID(objectID);
  if (object == null) return <></>;

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
        <div className="ModalBody">
          <ObjectDetails object={object} />
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
