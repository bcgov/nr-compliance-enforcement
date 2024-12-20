export const INITIAL_TOKEN = "";
export const INITIAL_REFRESH_TOKEN = "";

export const COS_USER_CREDS = {
  username: "",
  password: "",
  officerGuid: "",
};

export const generateRequestConfig = (token) => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};
