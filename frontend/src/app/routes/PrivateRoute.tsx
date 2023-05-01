import { useKeycloak } from "@react-keycloak/web";
import NotAuthorized from "../pages/NotAuthorized";
import { Outlet } from 'react-router-dom';

    /**
     * A private route that determines if a user has the correct role to execute the route.  The user's role is determined
     * via the user's JWT.  The route's role is defined in the route itself using the role attribute.
     * @param param0 
     * @returns 
     */
    const PrivateRoute = ({ role }: any) => {
        const { keycloak } = useKeycloak();

        const jwt = keycloak.tokenParsed;
        const userroles = jwt?.client_roles;

        // If the user isn't authenticated, or the route isn't protected with a role, the user isn't authorized to see a screen. 
        if (!!keycloak?.authenticated || !role) {
            return <NotAuthorized/>;
        }

        // Determines if a user's role(s) overlap with the role on the private route.
        const includesRoles = typeof role === 'string' ? userroles?.includes(role) : role.some((r: any) => userroles?.includes(r));

        console.log(`Includes Roles? ${includesRoles}`);
        console.log(`User roles: ${userroles}`);
        console.log(`Route roles: ${role}`);

        return includesRoles ? <Outlet /> : <NotAuthorized/>;
    };

export default PrivateRoute;