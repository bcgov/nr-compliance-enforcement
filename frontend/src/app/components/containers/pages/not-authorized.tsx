import { FC, ReactNode } from "react";
import logoLg from "../../../../assets/images/branding/BCgov-lg.png";
import { Footer, Header } from "../../containers/layout";
import { BsPersonFillSlash } from "react-icons/bs";
import { Link } from "react-router-dom";

type props = {
  children?: ReactNode;
};

const NotAuthorized: FC<props> = () => {
  return (
    <div className="comp-app-container fixed-header">
      {/* <!-- --> */}

      <Header />

      <div className="error-container">
        <div className="message">
          <BsPersonFillSlash />
          <h1 className="comp-padding-top-25">Sorry, you are not authorized to access this site</h1>If you think you
          should have access, please contact <a href="mailto:CEDS@gov.bc.ca">CEDS@gov.bc.ca</a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotAuthorized;
