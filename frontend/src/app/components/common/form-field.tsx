import { FC, ReactNode } from "react";

interface FormFieldProps {
  form: any;
  name: string;
  label: string;
  required?: boolean;
  validators?: any;
  render: (field: any) => ReactNode;
}

/**
 * Wrapper component that works around a sonarqube rule disallowing setting the
 * children prop, which is the recommended pattern for tanstack forms.
 */
export const FormField: FC<FormFieldProps> = ({ form, name, label, required = false, validators, render }) => (
  <form.Field
    name={name}
    validators={validators}
  >
    {(field: any) => (
      <div className="comp-details-form-row">
        <label htmlFor={`${name}-input`}>
          {label}
          {required && <span className="required-ind">*</span>}
        </label>
        <div className="comp-details-edit-input">{render(field)}</div>
      </div>
    )}
  </form.Field>
);
