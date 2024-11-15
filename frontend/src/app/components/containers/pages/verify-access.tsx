import { FC, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Footer, Header } from "@components/containers/layout";
import { TbFaceId, TbFaceIdError, TbLockAccess } from "react-icons/tb";
import { validate as uuidValidate } from "uuid";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { validateComsAccess } from "@store/reducers/app";
import { ErrorMessage } from "./error-message";

type Props = {};

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

export const VerifyAccess: FC<Props> = () => {
  const dispatch = useAppDispatch();
  const query = useQuery();
  const [isValid, setIsValid] = useState<boolean | undefined>();

  const isLoading = useAppSelector((state) => state?.app?.loading?.isLoading);
  const token = query.get("token");

  useEffect(() => {
    if (!isLoading) {
      if (token && uuidValidate(token)) {
        dispatch(validateComsAccess(token)).then((res) => {
          const { status } = res;
          if (status !== "success") {
            setIsValid(false);
          }
          if (status === "success") {
            setIsValid(true);

            setTimeout(() => {
              window.location.href = "/complaints";
            }, 3000);
          }
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const renderResult = () => {
    if (isValid === undefined) {
      return (
        <ErrorMessage
          icon={TbLockAccess}
          header="Verifying access"
        >
          Your access is being verified. You will be redirected to the application once verified. <br />
          If you have any problems, please contact the Compliance and Enforcement Digital Service team at{" "}
          <a href="mailto:CEDS@gov.bc.ca">CEDS@gov.bc.ca</a>
        </ErrorMessage>
      );
    } else if (isValid) {
      return (
        <ErrorMessage
          icon={TbFaceId}
          header="Access granted"
        >
          Your access has been verified. You will be redirected to the application shortly. <br />
          If you are not redirected in 5 seconds click the link to continue:{" "}
          <Link to="/complaints">NatComplaints - List View</Link> <br />
          If you have any problems, please contact the Compliance and Enforcement Digital Service team at{" "}
          <a href="mailto:CEDS@gov.bc.ca">CEDS@gov.bc.ca</a>
        </ErrorMessage>
      );
    } else {
      return (
        <ErrorMessage
          icon={TbFaceIdError}
          header="Access denied"
        >
          {" "}
          Your access link has expired or is incorrect. <br />
          Please contact the Compliance and Enforcement Digital Services team at{" "}
          <a href="mailto:CEDS@gov.bc.ca">CEDS@gov.bc.ca</a> to request a new link to get access.
        </ErrorMessage>
      );
    }
  };

  return (
    <div className="comp-app-container">
      <Header />

      <div className="error-container">{renderResult()}</div>

      <Footer />
    </div>
  );
};
