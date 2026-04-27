import React from "react";
import { Alert } from "react-bootstrap";

type Props = {
  mapType: string;
};

const NonDismissibleAlert: React.FC<Props> = ({ mapType }) => {
  return (
    <Alert
      className="comp-complaint-details-alert"
      variant="warning"
    >
      <i className="bi bi-info-circle-fill"></i>
      <span>The exact location of the {mapType.toLowerCase()} could not be determined.</span>
    </Alert>
  );
};
export default NonDismissibleAlert;
