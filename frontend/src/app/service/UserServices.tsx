import Keycloak from "keycloak-js";
import _kc from "../keycloak";



/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback: () => void) => {
    
  _kc.init({
    onLoad: 'login-required',
    pkceMethod: 'S256',
  })
    .then((authenticated) => {
      if (!authenticated) {
        console.log("user is not authenticated!");
      }
      onAuthenticatedCallback();
    })
    .catch(console.error);
};

const doLogin = _kc.login;

const doLogout = _kc.logout;

const getToken = () => _kc.token;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback: ((value: boolean) => boolean | PromiseLike<boolean>) | null | undefined) =>
  _kc.updateToken(5)
    .then(successCallback)
    .catch(doLogin);

const getUsername = () => _kc.tokenParsed?.display_name;


const hasRole = (roles: any) => {
    const jwt = _kc.tokenParsed;
    const userroles = jwt?.client_roles;
    
    // Determines if a user's role(s) overlap with the role on the private route.
    const includesRoles = typeof roles === 'string' ? userroles?.includes(roles) : roles.some((r: any) => userroles?.includes(r));

    return includesRoles;

}

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  hasRole,
};

export default UserService;
