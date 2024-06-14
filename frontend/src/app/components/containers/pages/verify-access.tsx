import { FC, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoLg from "../../../../assets/images/branding/BCgov-lg.png";
import { Footer } from "../layout";
import { TbFaceId, TbFaceIdError, TbLockAccess } from "react-icons/tb";
import { validate as uuidValidate } from "uuid";
import { useAppDispatch } from "../../../hooks/hooks";
import { validateComsAccess } from "../../../store/reducers/app";

type Props = {};

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

export const VerifyAccess: FC<Props> = () => {
  const dispatch = useAppDispatch();
  const query = useQuery();

  const [isValid, setIsValid] = useState<boolean | undefined>();
  const [heading, setHeading] = useState("Verifying Access");
  const [message, setMessage] = useState("Verifying your access...");

  useEffect(() => {
    const token = query.get("token");

    if (token && uuidValidate(token)) {
      dispatch(validateComsAccess(token));
      setIsValid(true);
    } else if (token && !uuidValidate(token)) {
      setHeading("Unable to Verify Access");
      setMessage("Unable to verify access to system. Access token provided is invalid");
      setIsValid(false);
    } else {
      setHeading("Unable to Verify Access");
      setMessage("Unable to verify access to system. No access token provided");
      setIsValid(false);
    }
  }, [query]);

  return (
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
        <div className="message">
          {isValid === undefined ? <TbLockAccess /> : !isValid ? <TbFaceIdError /> : <TbFaceId />}
          <h1 className="comp-padding-top-25">{heading}</h1>
          {message} If you still have problems, contact the Compliance & Enforcement Digital Services team at{" "}
          <a href="mailto:CEDS@gov.bc.ca">CEDS@gov.bc.ca</a>
        </div>
      </div>

      <Footer />
    </div>
  );
};
