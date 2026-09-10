import { FC, Fragment } from "react";
import { FormField } from "@components/common/form-field";
import { CompInput } from "@/app/components/common/comp-input";
import { CompSelect } from "@components/common/comp-select";
import { Button } from "react-bootstrap";
import { DropdownOption } from "@apptypes/app/drop-down-option";
import { getFieldErrorMessage } from "@/app/components/containers/parties/form/party-form-errors";
import { PartyExternalIdFormValue } from "@/app/components/containers/parties/form/party-form-utils";

type PartyExternalIdFieldsProps = {
  form: any;
  isDisabled: boolean;
  externalIds: PartyExternalIdFormValue[];
  externalIdOptions: DropdownOption[];
  label?: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

/**
 * A pair of External ID type and ID value. Both halves are required.
 */
export const PartyExternalIdFields: FC<PartyExternalIdFieldsProps> = ({
  form,
  isDisabled,
  externalIds,
  externalIdOptions,
  label = "External identifier",
  onAdd,
  onRemove,
}) => (
  <>
    {(externalIds ?? []).map((externalId: PartyExternalIdFormValue, index: number) => (
      <Fragment key={externalId.partyExternalIdGuid || `external-id-${index}`}>
        <FormField
          form={form}
          name={`externalIds[${index}].externalIdCode` as any}
          label={index === 0 ? label : ""}
          validators={{
            // re-run when the other value of the pair changes
            onChangeListenTo: [`externalIds[${index}].externalIdValue`],
            // a started pair must be completed or removed
            onChange: ({ value, fieldApi }: any) => {
              const row = fieldApi.form.getFieldValue(`externalIds[${index}]`) ?? {};
              const started = !!value?.trim() || !!row.externalIdValue?.trim();
              return started && !value?.trim() ? "External ID type is required" : undefined;
            },
          }}
          render={(field) => (
            <div className="party-alias-container">
              <div className="party-multiple-value-container">
                <CompSelect
                  id={`external-id-${index}`}
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={externalIdOptions}
                  value={externalIdOptions?.find((opt: any) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value ?? "")}
                  placeholder="Select external ID"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={getFieldErrorMessage(field)}
                  isDisabled={isDisabled}
                />
              </div>
            </div>
          )}
        />
        <FormField
          form={form}
          name={`externalIds[${index}].externalIdValue` as any}
          label=""
          validators={{
            // re-run when the other value of the pair changes
            onChangeListenTo: [`externalIds[${index}].externalIdCode`],
            // a started pair must be completed or removed
            onChange: ({ value, fieldApi }: any) => {
              const row = fieldApi.form.getFieldValue(`externalIds[${index}]`) ?? {};
              const started = !!value?.trim() || !!row.externalIdCode?.trim();
              return started && !value?.trim() ? "ID value is required" : undefined;
            },
          }}
          render={(field) => (
            <div className="party-alias-container">
              <div className="party-multiple-value-container">
                <CompInput
                  id={`external-id-value-${index}`}
                  divid=""
                  type="input"
                  inputClass="comp-form-control comp-details-input"
                  value={field.state.value}
                  error={getFieldErrorMessage(field)}
                  maxLength={64}
                  onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                  placeholder="Enter ID"
                  disabled={isDisabled}
                />
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onRemove(index)}
                type="button"
              >
                <i className="bi bi-trash" />
                {/**/}
                Remove
              </Button>
            </div>
          )}
        />
      </Fragment>
    ))}
    <FormField
      form={form}
      name="add-external-id-placeholder"
      label=""
      render={() => (
        <Button
          id="add-external-id-button"
          variant="outline-primary"
          size="sm"
          onClick={onAdd}
          type="button"
          disabled={isDisabled}
        >
          <i className="bi bi-plus-circle me-1" />
          {/**/}
          Add {label.toLowerCase()}
        </Button>
      )}
    />
  </>
);
