import PropTypes from 'prop-types'
import UserService from '../app/service/UserServices';
import NotAllowed from './NotAllowed';

/**
 * Renders the child element if the user is authorized using the UserService.hasRole method.
 */
const RenderOnRole = ({ roles, children }) => { return (UserService.hasRole(roles)) ? children : <NotAllowed/>;}

RenderOnRole.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default RenderOnRole
