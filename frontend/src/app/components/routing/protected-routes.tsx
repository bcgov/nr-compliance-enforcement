import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Roles from "../../types/app/roles";
import Layout from "../containers/layout";
import { AUTH_TOKEN } from "../../service/user-service";

interface ProtectedRoutesProps {
  roles: Array<Roles>;
}

interface DecodedToken {
  client_roles: Array<Roles>;
}

const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN);
};

const hasRequiredRole = (userRoles: Array<Roles>, requiredRoles: Array<Roles>): boolean => {
  return requiredRoles.some((role) => userRoles?.includes(role));
};

export const ProtectedRoutes: FC<ProtectedRoutesProps> = ({ roles }) => {
  const token = getAuthToken();
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
