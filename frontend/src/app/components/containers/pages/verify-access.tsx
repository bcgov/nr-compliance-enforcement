import { FC, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoLg from "../../../../assets/images/branding/BCgov-lg.png";
import { Footer } from "../layout";
import { TbFaceId, TbFaceIdError, TbLockAccess } from "react-icons/tb";
import { validate as uuidValidate } from "uuid";
import { useAppDispatch } from "../../../hooks/hooks";
import { validateComsAccess } from "../../../store/reducers/app";
import config from "../../../../config";
import EnvironmentBanner from "../layout/environment-banner";

type Props = {};

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

export const VerifyAccess: FC<Props> = () => {
  const dispatch = useAppDispatch();
  const query = useQuery();

  const [isValid, setIsValid] = useState<boolean | undefined>();

  const environmentName = config.ENVIRONMENT_NAME || "production";

  useEffect(() => {
    const token = query.get("token");

    if (token && uuidValidate(token)) {
      dispatch(validateComsAccess(token)).then((res) => {
        const { status } = res;
        console.log(res);
        if (status !== "success") {
          setIsValid(false);
        }
      });
      setIsValid(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <>
      {environmentName !== "production" && <EnvironmentBanner environmentName={environmentName} />}
      <div className="comp-app-container fixed-header">
        {/* <!-- --> */}

        <div className="comp-header">
          <Link
            className="comp-header-logo"
            to="/"
          >
            <picture>
              <source srcSet={logoLg}></source>
              <img
                src={logoLg}
                alt={"Government of British Columbia"}
              />
            </picture>
            NatComplaints
          </Link>

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
          {isValid === undefined ? <Verifying /> : isValid ? <Succcess /> : <Error />}
        </div>

        <Footer />
      </div>
    </>
  );
};

const Verifying = () => {
  return (
    <div className="message">
      <TbLockAccess />
      <h1 className="comp-padding-top-25">Verifying access</h1>
      Your access is being verified. You will be redirected to the application once verified. <br />
      If you have any problems, please contact the Compliance and Enforcement Digital Service team at{" "}
      <a href="mailto:CEDS@gov.bc.ca">CEDS@gov.bc.ca</a>
    </div>
  );
};

const Succcess = () => {
  return (
    <div className="message">
      <TbFaceId />
      <h1 className="comp-padding-top-25">Access granted</h1>
      Your access has been verified. You will be redirected to the application shortly. <br />
      If you have any problems, please contact the Compliance and Enforcement Digital Service team at{" "}
      <a href="mailto:CEDS@gov.bc.ca">CEDS@gov.bc.ca</a>
    </div>
  );
};

const Error = () => {
  return (
    <div className="message">
      <TbFaceIdError />
      <h1 className="comp-padding-top-25">Access denied</h1>
      Your access link has expired or is incorrect. <br />
      Please contact the Compliance and Enforcement Digital Services team at{" "}
      <a href="mailto:CEDS@gov.bc.ca">CEDS@gov.bc.ca</a> to request a new link to get access.
    </div>
  );
};
