import { FC } from "react";
import { Footer } from "@components/containers/layout";
import { BsPersonFillSlash } from "react-icons/bs";
import { Link } from "react-router-dom";

const CaseManagementPilotRestricted: FC = () => {
  return (
    <div className="comp-app-container">
      <div className="error-container">
        <div className="message">
          <BsPersonFillSlash />
          <div className="message-details">
            <h1 className="comp-padding-top-25">Sorry, you are not authorized to access this page.</h1>

            <p>
              This page is only accessible to pilot users of case management in NatSuite and will be available to
              additional groups in the future. Contact{" "}
              <a href="mailto:ceds@gov.bc.ca">ceds@gov.bc.ca</a> for additional questions
            </p>

            <p>
              Return to the <Link to="/complaints/">home page</Link> to continue.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CaseManagementPilotRestricted;
