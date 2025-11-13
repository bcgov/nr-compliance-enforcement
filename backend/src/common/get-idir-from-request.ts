export const getIdirFromRequest = (request: any): string => {
  const {
    user: { idir_username: idir },
  } = request;

  return idir;
};
export const getUserAuthGuidFromRequest = (request: any): string => {
  const {
    user: { idir_user_guid: guid },
  } = request;

  return guid;
};
