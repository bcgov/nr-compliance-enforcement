import { ReactFormApi } from "@tanstack/react-form";
import notificationInvalid from "@assets/images/notification-invalid.png";

interface FormStatusProps {
  form: ReactFormApi<any, any, any, any, any, any, any, any, any, any, any, any>;
}
export const FormErrorBanner = ({ form }: FormStatusProps) => {
  return (
    <form.Subscribe
      selector={(state) => {
        const isAnyFieldValidating = Object.values(state.fieldMeta).some((meta) => meta.isValidating);
        return [state.canSubmit, isAnyFieldValidating];
      }}
    >
      {([canSubmit, isAnyFieldValidating]) => {
        if (!canSubmit && !isAnyFieldValidating) {
          return (
            <div
              id="complaint-error-notification"
              className="comp-complaint-error"
            >
              <img
                src={notificationInvalid}
                alt="error"
                className="filter-image-spacing"
              />
              Errors in form
            </div>
          );
        }
        return null;
      }}
    </form.Subscribe>
  );
};
