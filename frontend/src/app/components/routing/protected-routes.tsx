import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "../containers/layout";
import { Roles } from "../../constants/roles"

export const ProtectedRoutes: FC<{ roles: Array<Roles> }> = () => {
  let auth = { token: true };
  return auth.token ? (
    <Layout fixedHeader fixedSidebar>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/not-authorized" />
  );
};
