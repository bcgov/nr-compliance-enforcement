import { FC } from "react";
import { Footer, Header } from "../../containers/layout";
import { BsFileEarmarkX } from "react-icons/bs";
import { Link } from "react-router-dom";

const NotFound: FC = () => {
  return (
    <div className="comp-app-container">
      <Header />

      <div className="error-container">
        <div className="message">
          <BsFileEarmarkX />
          <h1 className="comp-padding-top-25">The page or content you are looking for is not found.</h1>
          <p>
            Return to the <Link to="/complaints/">home page</Link> to try again.
          </p>
          <p>
            If you still have problems, please contact <a href="mailto:CEDS@gov.bc.ca">CEDS@gov.bc.ca</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
