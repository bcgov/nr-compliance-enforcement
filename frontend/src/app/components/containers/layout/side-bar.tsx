import { FC } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { isSidebarOpen, toggleSidebar, isFeatureActive } from "@store/reducers/app";
import MenuItem from "@apptypes/app/menu-item";
import { Link } from "react-router-dom";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { AgencyBanner } from "./agency-banner";
import UserService from "@service/user-service";
import { Roles } from "@apptypes/app/roles";
import { FEATURE_TYPES } from "@constants/feature-flag-types";

export const SideBar: FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(isSidebarOpen);

  const menuItems: Array<MenuItem> = [
    {
      id: "cases-link",
      name: "Cases",
      icon: "bi bi-folder",
      route: "/cases",
      hidden: !useAppSelector(isFeatureActive(FEATURE_TYPES.CASES)),
    },
    {
      id: "complaints-link",
      name: "Complaints",
      icon: "bi bi-file-earmark-medical",
      route: "/complaints",
    },
    {
      id: "investigations-link",
      name: "Investigations",
      icon: "bi bi-incognito",
      route: "/investigations",
      hidden: !useAppSelector(isFeatureActive(FEATURE_TYPES.INVESTIGATIONS)),
    },
    {
      id: "inspections-link",
      name: "Inspections",
      icon: "bi bi-ui-checks",
      route: "/inspections",
      hidden: !useAppSelector(isFeatureActive(FEATURE_TYPES.INSPECTIONS)),
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
    {
      id: "parties-link",
      name: "Parties",
      icon: "bi bi-file-earmark-image",
      route: "/parties",
      hidden: !useAppSelector(isFeatureActive(FEATURE_TYPES.PARTIES_OF_INTEREST)),
    },
  ];

  const bottomMenuItem: MenuItem = {
    id: "compliments-link",
    name: "Compliments",
    icon: "bi bi-heart",
    route: "/compliments",
    hidden: !useAppSelector(isFeatureActive(FEATURE_TYPES.COMPLIMENT)),
  };

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

  const renderBottomMenuItem = (item: MenuItem): JSX.Element | null => {
    const { excludedRoles, requiredRoles, hidden } = item;
    if (
      (excludedRoles && UserService.hasRole(excludedRoles)) ||
      (requiredRoles && !UserService.hasRole(requiredRoles)) ||
      hidden
    ) {
      return null;
    }
    return renderSideBarMenuItem(-1, item);
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
          {menuItems.map((item, idx) => {
            // Check if the user has an excluded role (e.g. hide ZAG)
            if (item.excludedRoles && UserService.hasRole(item.excludedRoles)) {
              return null; // Exclude this item if the user has an excluded role
            }
            // Check if the item has required roles and if the user has the required role
            if (item.requiredRoles && !UserService.hasRole(item.requiredRoles)) {
              return null; // Exclude this item if the user does not have the required role
            }
            // Check if the item is hidden
            if (item.hidden) {
              return null;
            }
            // If neither excludedRoles, requiredRoles, nor featureFlag conditions apply, render the item
            return renderSideBarMenuItem(idx, item);
          })}
        </ul>
        <ul
          className="nav nav-pills flex-column comp-sidenav-list"
          style={{ marginBottom: "8px" }}
        >
          {renderBottomMenuItem(bottomMenuItem)}
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
