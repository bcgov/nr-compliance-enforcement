import React from "react";
import { Alert } from "react-bootstrap";

const NonDismissibleAlert: React.FC = () => {
  return (
    <Alert variant="warning">
      <i className="bi bi-info-circle-fill"></i>
      <span>The exact location of the complaint could not be determined.</span>
    </Alert>
  );
};

export default NonDismissibleAlert;
