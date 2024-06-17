import { FC, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoLg from "../../../../assets/images/branding/BCgov-lg.png";
import { Footer } from "../layout";
import { TbFaceId, TbFaceIdError, TbLockAccess } from "react-icons/tb";
import { validate as uuidValidate } from "uuid";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { validateComsAccess } from "../../../store/reducers/app";
import config from "../../../../config";
import EnvironmentBanner from "../layout/environment-banner";
import { IconType } from "react-icons/lib";

type Props = {};

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

export const VerifyAccess: FC<Props> = () => {
  const dispatch = useAppDispatch();
  const query = useQuery();

  const [isValid, setIsValid] = useState<boolean | undefined>();
  const [wasRun, setWasRun] = useState(false);

  const environmentName = config.ENVIRONMENT_NAME || "production";
  const isLoading = useAppSelector((state) => state?.app?.loading?.isLoading);

  useEffect(() => {
    const token = query.get("token");

    if (!isLoading && !wasRun) {
      if (token && uuidValidate(token) && !wasRun) {
        dispatch(validateComsAccess(token)).then((res) => {
          const { status } = res;
          if (status !== "success") {
            setIsValid(false);
          }
          if (status === "success") {
            setIsValid(true);
            setWasRun(true);
            window.location.href = "/complaints";
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, isLoading, wasRun]);

  const renderResult = () => {
    if (isValid === undefined) {
      return (
        <Message
          icon={TbLockAccess}
          header="Verifying access"
        >
          Your access is being verified. You will be redirected to the application once verified. <br />
          If you have any problems, please contact the Compliance and Enforcement Digital Service team at{" "}
          <a href="mailto:CEDS@gov.bc.ca">CEDS@gov.bc.ca</a>
        </Message>
      );
    } else if (isValid) {
      return (
        <Message
          icon={TbFaceId}
          header="Access granted"
        >
          Your access has been verified. You will be redirected to the application shortly. <br />
          If you are not redirected in 5 seconds click the link to continue: <Link to="/" /> <br />
          If you have any problems, please contact the Compliance and Enforcement Digital Service team at{" "}
          <a href="mailto:CEDS@gov.bc.ca">CEDS@gov.bc.ca</a>
        </Message>
      );
    } else {
      return (
        <Message
          icon={TbFaceIdError}
          header="Access denied"
        >
          {" "}
          Your access link has expired or is incorrect. <br />
          Please contact the Compliance and Enforcement Digital Services team at{" "}
          <a href="mailto:CEDS@gov.bc.ca">CEDS@gov.bc.ca</a> to request a new link to get access.
        </Message>
      );
    }
  };

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

        <div className="error-container">{renderResult()}</div>

        <Footer />
      </div>
    </>
  );
};

type props = {
  icon: IconType;
  header: string;
  children: React.ReactNode;
};

const Message: FC<props> = ({ icon, header, children }) => {
  const Icon = icon;

  return (
    <div className="message">
      <Icon />
      <h1 className="comp-padding-top-25">{header}</h1>
      {children}
    </div>
  );
};
