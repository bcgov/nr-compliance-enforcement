import { FC, ReactNode } from "react";
import { useErrorBoundary } from "@hooks/error-boundary";
import logoLg from "@assets/images/branding/BCgov-lg.png";
import { Footer } from "@components/containers/layout";
import { TbFaceIdError } from "react-icons/tb";

type props = {
  children?: ReactNode;
};

const GenericErrorBoundary: FC<props> = ({ children }) => {
  const [error] = useErrorBoundary();

  if (error) {
    return (
      <div className="comp-app-container fixed-header">
        {/* <!-- --> */}

        <div className="comp-header">
          <a
            href="/"
            className="comp-header-logo"
          >
            <picture>
              <source srcSet={logoLg}></source>
              <img
                src={logoLg}
                alt={"Government of British Columbia"}
              />
            </picture>
            NatComplaints
          </a>
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
            <div className="message-details">
              <h1 className="comp-padding-top-25">System error</h1>

              {/* <!-- The link in this section can't use react router as it 
             sits above the Routes in index.ts  --> */}
              <p>
                Refresh the page or return to the <a href="/">home page</a> to try again.
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
  }

  return <>{children}</>;
};

export default GenericErrorBoundary;
