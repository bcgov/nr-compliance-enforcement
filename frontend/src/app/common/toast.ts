import { ReactNode } from "react";
import { Id, toast, ToastOptions } from "react-toastify";

export const ToggleSuccess = (message: string | ReactNode, options?: ToastOptions) => {
  toast.success(message, options);
};

export const ToggleInformation = (message: string, options?: ToastOptions) => {
  return toast.info(message, options);
};

export const ToggleError = (message: string) => {
  toast.error(message);
};

export const DismissToast = (toastId: Id) => {
  toast.dismiss(toastId);
};
