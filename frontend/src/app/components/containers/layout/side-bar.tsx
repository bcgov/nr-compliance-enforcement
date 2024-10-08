import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { isSidebarOpen, toggleSidebar } from "../../../store/reducers/app";
import MenuItem from "../../../types/app/menu-item";
import { Link } from "react-router-dom";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { AgencyBanner } from "./agency-banner";
import UserService from "../../../service/user-service";
import Roles from "../../../types/app/roles";

export const SideBar: FC = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(isSidebarOpen);

  const menueItems: Array<MenuItem> = [
    {
      id: "complaints-link",
      name: "Complaints",
      icon: "bi bi-file-earmark-medical",
      route: "/complaints",
      roles: ["COS", "CEEB"],
    },
    {
      id: "create-complaints-link",
      name: "Create Complaint",
      icon: "bi bi-plus-circle",
      route: "complaint/createComplaint",
      roles: ["COS", "CEEB"],
    },
    {
      id: "zone-at-a-glance-link",
      name: "Zone at a Glance",
      icon: "bi bi-buildings",
      route: "/zone/at-a-glance",
      roles: ["COS"],
    },
  ];

  const renderSideBarMenuItem = (idx: number, item: MenuItem): JSX.Element => {
    const { id, icon, name, route } = item;

    return isOpen ? (
      <li key={`sb-open-${idx}`}>
        {!route ? (
          <div className="comp-sidenav-item comp-sidenav-item-lg">
            <i className={`comp-sidenav-item-icon ${icon}`}></i>
            <span className="comp-sidenav-item-name">{name}</span>
          </div>
        ) : (
          <Link
            className="comp-sidenav-item comp-sidenav-item-lg"
            to={route}
            id={id}
          >
            <i className={`comp-sidenav-item-icon ${icon}`}></i>
            <span className="comp-sidenav-item-name">{name}</span>
          </Link>
        )}
      </li>
    ) : (
      <OverlayTrigger
        key={`overlay-${idx}`}
        placement="right"
        overlay={
          <Tooltip
            id={`tt-${id}`}
            className="comp-tooltip comp-tooltip-right"
          >
            {name}
          </Tooltip>
        }
      >
        <li key={`sb-closed-${idx}`}>
          {!route ? (
            <div
              className="comp-sidenav-item comp-sidenav-item-sm"
              aria-label={name}
            >
              <i className={`comp-sidenav-item-icon ${icon}`}></i>
            </div>
          ) : (
            <Link
              className="comp-sidenav-item comp-sidenav-item-sm"
              to={route}
              id={`icon-${id}`}
              aria-label={name}
            >
              <i className={`comp-sidenav-item-icon ${icon}`}></i>
            </Link>
          )}
        </li>
      </OverlayTrigger>
    );
  };

  return (
    <div className={`d-flex flex-column flex-shrink-0 comp-sidebar ${(!isOpen ? "collapsed" : "").trim()}`}>
      {/* <!-- organization name --> */}
      <AgencyBanner />

      {/* <!-- menu items for the organization --> */}
      <ul className="nav nav-pills flex-column mb-auto comp-sidenav-list">
        {menueItems.map((item, idx) => {
          if (UserService.hasRole(Roles.CEEB) && !item.roles.includes("CEEB")) {
            // Do not display this hence return null
            return null;
          }
          return renderSideBarMenuItem(idx, item);
        })}
      </ul>
      <div
        className="comp-sidebar-toggle"
        onClick={() => {
          dispatch(toggleSidebar());
        }}
      >
        <i className={`bi ${isOpen ? "bi-chevron-double-left" : "bi-chevron-double-right"}`}></i>
      </div>
    </div>
  );
};
