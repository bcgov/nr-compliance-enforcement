export const INITIAL_COS_TOKEN = "";
export const INITIAL_COS_REFRESH_TOKEN = "";

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

const CEEB_USER_TOKEN = "xxxxxxx";
export const CEEB_USER_CREDS = {
  username: "",
  password: "",
};

export const CEEB_USER_HEADERS = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${CEEB_USER_TOKEN}`,
  },
};
