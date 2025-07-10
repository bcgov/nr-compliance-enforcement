import { FC } from 'react'
import logoSm from '@/assets/branding/BCgov-vert-sm.png'
import logoLg from '@/assets/branding/BCgov-lg.png'
import { Link } from '@tanstack/react-router'
import EnvironmentBanner from './environmentBanner'
import { config } from '@/config'
import { useOidc } from '@/auth/oidc'
import { Button } from 'react-bootstrap'

export const Header: FC = () => {
  const { decodedIdToken, isUserLoggedIn, logout } = useOidc()
  const initials = isUserLoggedIn
    ? decodedIdToken?.given_name?.charAt(0) +
      decodedIdToken?.family_name?.charAt(0)
    : ''

  const environmentName = config.VITE_ENVIRONMENT_NAME || 'production'

  return (
    <div>
      {environmentName !== 'production' && (
        <EnvironmentBanner environmentName={environmentName} />
      )}
      <div className="header">
        <Link className="header-logo" to="/">
          <picture>
            <source srcSet={logoLg} media="(min-width: 980px)"></source>
            <source srcSet={logoSm}></source>
            <img src={logoSm} alt={'Government of British Columbia'} />
          </picture>
          NatInvestigations
        </Link>

        <div className="header-content">
          <div className="header-left">
            {/* <!-- future left hand content --> */}
          </div>
          <div className="header-right">
            {/* User Profile Avatar and Menu */}
            {isUserLoggedIn && (
              <>
                <div className="header-profile-menu">
                  <div
                    data-initials={initials}
                    className="profile-avatar"
                  ></div>
                </div>
                <Button onClick={() => logout({ redirectTo: 'home' })}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
