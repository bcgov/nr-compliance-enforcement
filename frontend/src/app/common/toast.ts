import { ReactNode } from "react";
import { Id, toast, ToastOptions, ToastPosition } from "react-toastify";

export const TOAST_POSITION: ToastPosition = "bottom-right";

export const ToggleSuccess = (message: string | ReactNode, options?: ToastOptions) => {
  toast.success(message, options);
};

export const ToggleInformation = (message: string, options?: ToastOptions) => {
  return toast.info(message, options);
};

export const ToggleError = (message: string, options?: ToastOptions) => {
  toast.error(message, options);
};

export const ToggleWarning = (message: string, options?: ToastOptions) => {
  toast.warning(message, options);
};

export const UpdateToast = (toastId: Id, message: ReactNode) => {
  toast.update(toastId, { render: message });
};

// Timing can trigger race condition in some cases. Delay the dismiss to mitigate.
const UPDATE_DISMISS_DELAY_MS = 300;

export const DismissToast = (toastId: Id) => {
  setTimeout(() => toast.dismiss(toastId), UPDATE_DISMISS_DELAY_MS);
};
