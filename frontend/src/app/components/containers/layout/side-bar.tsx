import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  isSidebarOpen,
  toggleSidebar,
} from "../../../store/reducers/app";
import logo from "../../../../assets/images/icons/ce-cos-icon.svg";
import MenuItem from "../../../types/app/menu-item";
import { Link } from "react-router-dom";


export const SideBar: FC = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(isSidebarOpen);

  const menueItems: Array<MenuItem> = [
    {
      name: "Complaints",
      icon: "bi bi-file-earmark-medical",
      route: "/complaints",
    },
  ];

  const renderSideBarMenuItem = (idx: number, item: MenuItem): JSX.Element => {
    const { icon, name, route } = item;
    return (
      <li key={idx}>
        <i className={icon}></i>
        <span className="comp-nav-item-name">
          {!route ? <>{name}</> : <Link to={route}>{name}</Link>}
        </span>
      </li>
    );
  };

  return (
    <div
      className={`d-flex flex-column flex-shrink-0 comp-side-bar  ${(!isOpen
        ? "collapsed"
        : ""
      ).trim()}`}
    >
      {/* <!-- organization name --> */}
      <span className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none comp-organization-nav-item">
        <img className="comp-organization-nav-logo" src={logo} alt="logo" />
        <span className="comp-organization-nav-name">
          Conservation Officer Service
        </span>
      </span>

      {/* <!-- menu items for the organization --> */}

      <ul className="nav nav-pills flex-column mb-auto comp-nav-item-list">
        {menueItems.map((item, idx) => {
          return renderSideBarMenuItem(idx, item);
        })}
      </ul>
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
