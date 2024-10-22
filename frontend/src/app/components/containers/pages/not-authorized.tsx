import { FC } from "react";
import { Footer, Header } from "../../containers/layout";
import { BsPersonFillSlash } from "react-icons/bs";
import { Link } from "react-router-dom";

const NotAuthorized: FC = () => {
  return (
    <div className="comp-app-container">
      <Header />

      <div className="error-container">
        <div className="message">
          <BsPersonFillSlash />
          <h1 className="comp-padding-top-25">Sorry, you are not authorized to access this site</h1>

          <p>
            Return to the <Link to="/complaints/">home page</Link> to try logging in again.
          </p>

          <p>
            If you think you should have access, please contact <a href="mailto:CEDS@gov.bc.ca">CEDS@gov.bc.ca</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotAuthorized;
