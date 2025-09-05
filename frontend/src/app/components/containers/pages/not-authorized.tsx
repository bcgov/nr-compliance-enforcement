import { FC } from "react";
import { Footer, Header } from "@components/containers/layout";
import { BsPersonFillSlash } from "react-icons/bs";
import { Link } from "react-router-dom";

const NotAuthorized: FC = () => {
  return (
    <div className="comp-app-container">
      <Header />

      <div className="error-container">
        <div className="message">
          <BsPersonFillSlash />
          <div className="message-details">
            <h1 className="comp-padding-top-25">Sorry, you are not authorized to access this page.</h1>

            <p>
              If you believe you should have access, return to the <Link to="/complaints/">home page</Link> to try
              logging in again.
            </p>

            <p>
              If the problem persists, contact the Compliance & Enforcement Digital Services team at{" "}
              <a href="mailto:CEDS@gov.bc.ca">CEDS@gov.bc.ca</a>.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotAuthorized;
