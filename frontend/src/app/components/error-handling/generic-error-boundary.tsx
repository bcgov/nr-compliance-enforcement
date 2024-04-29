import { FC, ReactNode } from "react";
import { useErrorBoundary } from "../../hooks/error-boundary";
import logo from "../../../assets/images/branding/CE-Temp-Logo.svg";
import { Footer } from "../containers/layout";
import { TbFaceIdError } from "react-icons/tb";

type props = {
  children?: ReactNode;
};

const GenericErrorBoundary: FC<props> = ({ children }) => {
  const [error] = useErrorBoundary();

  if (error) {
    return (
      <div className="comp-container fixed-header">
        {/* <!-- --> */}

        <div className="comp-header">
          <div className="comp-header-logo comp-nav-item-icon-inverted">
            <img
              className="logo-src"
              src={logo}
              alt="logo"
            />
          </div>

          <div className="comp-header-content">
            <div className="comp-header-left">{/* <!-- future left hand content --> */}</div>
            <div className="comp-header-right">
              <div className="header-btn-lg pr-0">
                <div className="widget-content p-0">
                  <div className="widget-content-wrapper">
                    <div className="widget-content-left">{/* <!-- search --> */}</div>
                    <div className="widget-content-left"></div>
                    <div className="widget-content-right">
                      {/* <!-- --> */}

                      {/* <!-- --> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- --> */}

        <div className="error-container">
          <div className="message">
            <TbFaceIdError />
            {/* <br /> */}
            <h1 className="comp-padding-top-25">System error</h1>Please refresh the page to try again. If you still have
            problems, contact the Compliance & Enforcement Digital Services team at{" "}
            <a href="mailto:CEDS@gov.bc.ca">CEDS@gov.bc.ca</a>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return <>{children}</>;
};

export default GenericErrorBoundary;
