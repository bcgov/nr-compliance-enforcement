const COS_USER_TOKEN = "";

export const COS_USER_CREDS = {
  username: "",
  password: "",
};

export const COS_USER_HEADERS = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${COS_USER_TOKEN}`,
  },
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
