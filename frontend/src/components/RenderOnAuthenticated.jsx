import UserService from "../app/service/UserServices";


const RenderOnAuthenticated = ({ children }) => (UserService.isLoggedIn()) ? children : null;

export default RenderOnAuthenticated
