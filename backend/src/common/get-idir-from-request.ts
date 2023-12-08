export const getIdirFromRequest = (request: any): string => {
  const {
    user: { idir_username: idir },
  } = request;

  return idir;
};
