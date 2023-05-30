import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { isSidebarOpen, toggleSidebar } from "../../../store/reducers/app";
import logo from "../../../../assets/images/icons/ce-cos-icon.svg";
import { OrganizationNavbarItem } from "./organization-icon";

export const SideBar: FC = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(isSidebarOpen);

  return (
    <div
      className={`d-flex flex-column flex-shrink-0 comp-side-bar  ${(!isOpen
        ? "collapsed"
        : ""
      ).trim()}`}
    >
      <OrganizationNavbarItem name="Conservation Officer Service" logo={logo} />

      <div className="nav nav-pills flex-column mb-auto"></div>

      <div
        className="comp-sidebar-toggle"
        onClick={() => {
          dispatch(toggleSidebar());
        }}
      >
        <i
          className={`bi ${
            isOpen ? "bi-chevron-double-left" : "bi-chevron-double-right"
          }`}
        ></i>
      </div>
    </div>
  );
};
