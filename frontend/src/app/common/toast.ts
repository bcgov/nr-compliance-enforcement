import { ReactNode } from "react";
import { toast, ToastOptions } from "react-toastify";

export const ToggleSuccess = (message: string | ReactNode, options?: ToastOptions) => {
  toast.success(message, options);
};

export const ToggleInformation = (message: string) => {
  toast.info(message);
};

export const ToggleError = (message: string) => {
  toast.error(message);
};
