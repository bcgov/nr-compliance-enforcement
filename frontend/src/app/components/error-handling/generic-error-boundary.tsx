import { FC, ReactNode } from "react";
import { useErrorBoundary } from "../../hooks/error-boundary";
import logo from "../../../assets/images/branding/CE-Temp-Logo.svg";
import { Footer } from "../containers/layout";

type props = {
  children?: ReactNode;
};

const GenericErrorBoundary: FC<props> = ({ children }) => {
  const [error, errorInfo] = useErrorBoundary();

  if (error) {
    const { message, cause, name } = error;
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
        <div className="comp-main-content">
          <p>
            System error – please refresh the page to try again. If you still have problems, contact the Compliance &
            Enforcement Digital Services team at CEDS@gov.bc.ca
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
};

export default GenericErrorBoundary;
