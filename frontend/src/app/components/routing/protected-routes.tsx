import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Roles from "../../types/app/roles";
import Layout from "../containers/layout";

export const ProtectedRoutes: FC<{ roles: Array<Roles> }> = () => {
  let auth = { token: true };
  return auth.token ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/not-authorized" />
  );
};
