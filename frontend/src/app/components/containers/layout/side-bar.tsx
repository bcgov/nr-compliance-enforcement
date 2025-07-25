import { FC } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { isSidebarOpen, toggleSidebar } from "@store/reducers/app";
import MenuItem from "@apptypes/app/menu-item";
import { Link } from "react-router-dom";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { AgencyBanner } from "./agency-banner";
import UserService from "@service/user-service";
import { Roles } from "@apptypes/app/roles";

export const SideBar: FC = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(isSidebarOpen);

  const menueItems: Array<MenuItem> = [
    {
      id: "complaints-link",
      name: "Complaints",
      icon: "bi bi-file-earmark-medical",
      route: "/complaints",
    },
    {
      id: "create-complaints-link",
      name: "Create complaint",
      icon: "bi bi-plus-circle",
      route: "complaint/createComplaint",
      excludedRoles: [Roles.SECTOR],
    },
    {
      id: "zone-at-a-glance-link",
      name: "Zone at a glance",
      icon: "bi bi-buildings",
      route: "/zone/at-a-glance",
      excludedRoles: [Roles.CEEB, Roles.PARKS, Roles.PROVINCE_WIDE, Roles.SECTOR],
    },
    {
      id: "user-management",
      name: "User administration",
      icon: "bi bi-people",
      route: "/admin/user",
      requiredRoles: [Roles.TEMPORARY_TEST_ADMIN],
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
            className="comp-tooltip-dark comp-tooltip-right"
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
    <div className="sidebar-wrapper">
      <button
        className={`d-flex flex-column flex-shrink-0 comp-sidebar ${(!isOpen ? "collapsed" : "").trim()}`}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            dispatch(toggleSidebar());
          }
        }}
      >
        {/* <!-- organization name --> */}
        <AgencyBanner />

        {/* <!-- menu items for the organization --> */}
        <ul className="nav nav-pills flex-column mb-auto comp-sidenav-list">
          {menueItems.map((item, idx) => {
            // Check if the user has an excluded role (e.g. hide ZAG)
            if (item.excludedRoles && UserService.hasRole(item.excludedRoles)) {
              return null; // Exclude this item if the user has an excluded role
            }

            // Check if the item has required roles and if the user has the required role
            if (item.requiredRoles && !UserService.hasRole(item.requiredRoles)) {
              return null; // Exclude this item if the user does not have the required role
            }

            // If neither excludedRoles nor requiredRoles conditions apply, render the item
            return renderSideBarMenuItem(idx, item);
          })}
        </ul>
      </button>
      <OverlayTrigger
        key={`overlay-sidebar`}
        placement="right"
        overlay={
          <Tooltip
            id={`tt-sidebar`}
            className="comp-tooltip-dark comp-tooltip-right"
          >
            {isOpen ? "Click to collapse" : "Click to expand"}
          </Tooltip>
        }
      >
        <button
          type="button"
          className="comp-sidebar-toggle"
          onClick={() => {
            dispatch(toggleSidebar());
          }}
        >
          <i className={`bi comp-sidebar-toggle-icon ${isOpen ? "bi-chevron-left" : "bi-chevron-right"}`}></i>
        </button>
      </OverlayTrigger>
    </div>
  );
};
