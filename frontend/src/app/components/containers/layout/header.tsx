import { FC, useEffect } from "react";
import logoSm from "@assets/images/branding/BCgov-vert-sm.png";
import logoLg from "@assets/images/branding/BCgov-lg.png";
import { NavDropdown, Badge } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { alertCount, getTokenProfile, profileInitials, isFeatureActive } from "@store/reducers/app";
import { Link } from "react-router-dom";
import config from "@/config";
import EnvironmentBanner from "./environment-banner";
import { FEATURE_TYPES } from "@constants/feature-flag-types";

export const Header: FC = () => {
  const dispatch = useAppDispatch();

  const initials = useAppSelector(profileInitials);
  const alerts = useAppSelector(alertCount);
  const showExperimentalFeature = useAppSelector(isFeatureActive(FEATURE_TYPES.EXPERIMENTAL_FEATURE));

  useEffect(() => {
    if (!initials) {
      dispatch(getTokenProfile());
    }
  }, [initials, dispatch]);

  const renderBadge = (): JSX.Element => {
    return (
      <Badge
        bg="danger"
        pill
        className="comp-badge"
      >
        {alerts}
      </Badge>
    );
  };

  const environmentName = config.ENVIRONMENT_NAME || "production";

  return (
    <div>
      {environmentName !== "production" && <EnvironmentBanner environmentName={environmentName} />}
      <div className="comp-header">
        <Link
          className="comp-header-logo"
          to="/"
        >
          <picture>
            <source
              srcSet={logoLg}
              media="(min-width: 980px)"
            ></source>
            <source srcSet={logoSm}></source>
            <img
              src={logoSm}
              alt={"Government of British Columbia"}
            />
          </picture>
          NatComplaints
        </Link>

        <div className="comp-header-content">
          <div className="comp-header-left">{/* <!-- future left hand content --> */}</div>
          <div className="comp-header-right">
            {/* Notifications */}
            <div className="widget-content-left">
              {showExperimentalFeature && (
                <div className="comp-alert-badge">
                  <i className="bi bi-bell"></i>
                  {alerts > 0 && renderBadge()}
                </div>
              )}
            </div>

            {/* User Profile Avatar & Menu */}
            <div className="comp-header-profile-menu">
              {/* <!-- placeholder menu --> */}
              {showExperimentalFeature ? (
                <NavDropdown
                  title={
                    <div
                      data-initials={initials}
                      className="comp-profile-avatar"
                    ></div>
                  }
                >
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <div
                  data-initials={initials}
                  className="comp-profile-avatar"
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
