import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const NonDismissibleAlert: React.FC = () => {
  return (
    <div className="comp-complaint-details-alert">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span>The exact location of the complaint could not be determined.</span>
        </div>
  );
};

export default NonDismissibleAlert;
