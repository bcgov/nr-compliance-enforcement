import { FC, JSX, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import { AgencyBanner } from './agencyBanner'
import { Roles } from '@/interfaces/roles'
import { useOidc } from '@/auth/oidc'

interface MenuItem {
  id?: string
  name: string
  icon: string
  route?: string
  excludedRoles?: Array<Roles>
  requiredRoles?: Array<Roles>
}

export const SideBar: FC = () => {
  const { decodedIdToken, isUserLoggedIn } = useOidc()
  const userRoles = decodedIdToken?.client_roles ?? []
  const [isOpen, setIsOpen] = useState(true)

  const menuItems: Array<MenuItem> = [
    {
      id: 'investigations-link',
      name: 'Investigations',
      icon: 'bi bi-file-earmark-medical',
      route: '/investigations',
    },
    {
      id: 'persons-link',
      name: 'Persons',
      icon: 'bi bi-people-fill',
      route: '/persons',
    },
    {
      id: 'about-link',
      name: 'About',
      icon: 'bi bi-patch-question',
      route: '/about',
    },
    {
      id: 'protected-link',
      name: 'Protected By Login',
      icon: 'bi bi-file-lock',
      route: '/protected',
    },
    {
      id: 'protected-by-role-link',
      name: 'Protected By Role',
      icon: 'bi bi-file-lock-fill',
      route: '/protected-by-role',
    },
    {
      id: 'search-link',
      name: 'Search',
      icon: 'bi bi-search',
      route: '/search',
    },
  ]

  const sideBarMenuItem = (idx: number, item: MenuItem): JSX.Element => {
    const { id, icon, name, route } = item

    return isOpen ? (
      <li key={`sb-open-${idx}`}>
        {!route ? (
          <div className="sidenav-item sidenav-item-lg">
            <i className={`sidenav-item-icon ${icon}`}></i>
            <span className="sidenav-item-name">{name}</span>
          </div>
        ) : (
          <Link className="sidenav-item sidenav-item-lg" to={route} id={id}>
            <i className={`sidenav-item-icon ${icon}`}></i>
            <span className="sidenav-item-name">{name}</span>
          </Link>
        )}
      </li>
    ) : (
      <OverlayTrigger
        key={`overlay-${idx}`}
        placement="right"
        overlay={
          <Tooltip id={`tt-${id}`} className="tooltip tooltip-right">
            {name}
          </Tooltip>
        }
      >
        <li key={`sb-closed-${idx}`}>
          {!route ? (
            <div className="sidenav-item sidenav-item-sm" aria-label={name}>
              <i className={`sidenav-item-icon ${icon}`}></i>
            </div>
          ) : (
            <Link
              className="sidenav-item sidenav-item-sm"
              to={route}
              id={`icon-${id}`}
              aria-label={name}
            >
              <i className={`sidenav-item-icon ${icon}`}></i>
            </Link>
          )}
        </li>
      </OverlayTrigger>
    )
  }

  return !isUserLoggedIn ? (
    <></>
  ) : (
    <div
      className={`d-flex flex-column flex-shrink-0 sidebar ${(!isOpen ? 'collapsed' : '').trim()}`}
    >
      {/* <!-- organization name --> */}
      <AgencyBanner />

      {/* <!-- menu items for the organization --> */}
      <ul className="nav nav-pills flex-column mb-auto sidenav-list">
        {menuItems.map((item, idx) => {
          // Check if the user has an excluded role (e.g. hide ZAG)
          if (item.excludedRoles?.some((role) => userRoles.includes(role))) {
            return null // Exclude this item if the user has an excluded role
          }

          // Check if the item has required roles and if the user has the required role
          if (item.requiredRoles?.some((role) => !userRoles.includes(role))) {
            return null // Exclude this item if the user does not have the required role
          }

          // If neither excludedRoles nor requiredRoles conditions apply, render the item
          return sideBarMenuItem(idx, item)
        })}
      </ul>
      <button
        className="sidebar-toggle"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        aria-label="Toggle sidebar"
      >
        <i
          className={`bi ${isOpen ? 'bi-chevron-double-left' : 'bi-chevron-double-right'}`}
        ></i>
      </button>
    </div>
  )
}
