import { FC, useEffect } from "react";

import logo from "../../../../assets/images/branding/CE-Temp-Logo.svg";
import { NavDropdown, Badge } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { alertCount, getTokenProfile, profileInitials } from "../../../store/reducers/app";
import { Link } from "react-router-dom";

export const Header: FC = () => {
  const dispatch = useAppDispatch();

  const initials = useAppSelector(profileInitials);
  const alerts = useAppSelector(alertCount);

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

  return (
    <div className="comp-header">
      <div className="comp-header-logo comp-nav-item-icon-inverted">
        <Link to="/">
          <img
            className="logo-src"
            src={logo}
            alt="logo"
          />
        </Link>
      </div>

      <div className="comp-header-content">
        <div className="comp-header-left">{/* <!-- future left hand content --> */}</div>
        <div className="comp-header-right">
          <div className="header-btn-lg pr-0">
            <div className="widget-content p-0">
              <div className="widget-content-wrapper">
                <div className="widget-content-left">{/* <!-- search --> */}</div>
                <div className="widget-content-left">
                  <div className="item1">
                    <i className="bi bi-bell"></i>
                    {alerts > 0 && renderBadge()}
                  </div>
                </div>
                <div className="widget-content-right">
                  {/* <!-- --> */}

                  <NavDropdown
                    title={
                      <div
                        data-initials={initials}
                        className="comp-profile-avatar"
                      ></div>
                    }
                  >
                    {/* <!-- placeholder menu --> */}
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown>

                  {/* <!-- --> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
