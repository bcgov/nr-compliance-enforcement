import UserService from "../app/service/UserServices";

const RenderOnAnonymous = ({ children }) => (!UserService.isLoggedIn()) ? children : null;

export default RenderOnAnonymous
