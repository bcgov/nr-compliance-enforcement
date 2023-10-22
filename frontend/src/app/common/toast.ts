import { toast } from "react-toastify";

export const ToggleSuccess = (message: string) => {
  toast.success(message);
};

export const ToggleInformation = (message: string) => {
  toast.info(message);
};

export const ToggleError = (message: string) => {
  toast.error(message);
};
