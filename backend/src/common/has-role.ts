export const hasRole = (req, role: string) => {
  const userroles = req.user.client_roles;
  const hasRole = userroles?.includes(role);
  return hasRole;
};
