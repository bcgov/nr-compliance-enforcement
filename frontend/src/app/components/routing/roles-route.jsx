import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import NotAllowed from "./not-allowed";
import UserService from "../../service/user-service";

const RolesRoute = ({ roles, children, ...rest }) => (
  <Route {...rest}>
    {UserService.hasRole(roles) ? children : <NotAllowed />}
  </Route>
);

RolesRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RolesRoute;
