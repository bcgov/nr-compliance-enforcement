import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Roles from "../../types/app/roles";
import Layout from "../containers/layout";
import { AUTH_TOKEN } from "../../service/user-service";

type Props = {
  roles: Array<Roles>;
};

interface DecodedToken {
  client_roles: Array<Roles>;
}

export const ProtectedRoutes: FC<Props> = ({ roles }) => {
  const hasRequiredRole = (userRoles: Array<Roles>, requiredRoles: Array<Roles>): boolean => {
    return requiredRoles.some((role) => userRoles?.includes(role));
  };

  const token = localStorage.getItem(AUTH_TOKEN);
  if (!token) {
    return <Navigate to="/not-authorized" />;
  }

  let decodedToken: DecodedToken;
  try {
    decodedToken = jwt_decode(token);
  } catch (error) {
    return <Navigate to="/not-authorized" />;
  }

  if (!hasRequiredRole(decodedToken.client_roles, roles)) {
    return <Navigate to="/not-authorized" />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
