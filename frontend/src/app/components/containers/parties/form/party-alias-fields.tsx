import { FC } from "react";
import { FormField } from "@components/common/form-field";
import { CompInput } from "@/app/components/common/comp-input";
import { Alias } from "@/generated/graphql";
import { Button } from "react-bootstrap";

type PartyAliasFieldsProps = {
  form: any;
  isDisabled: boolean;
  aliases: Alias[];
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export const PartyAliasFields: FC<PartyAliasFieldsProps> = ({ form, isDisabled, aliases, onAdd, onRemove }) => (
  <>
    {aliases?.map((alias: Alias, index: number) => (
      <FormField
        key={alias.aliasGuid || `alias-${index}`}
        form={form}
        name={`aliases[${index}].name` as any}
        label={index === 0 ? "Alias(es)" : ""}
        render={(field) => (
          <div className="party-alias-container">
            <div className="party-multiple-value-container">
              <CompInput
                id={`alias-${index}`}
                divid=""
                type="input"
                inputClass="comp-form-control comp-details-input"
                value={field.state.value}
                error={field.state.meta.errors?.[0]?.message || ""}
                maxLength={512}
                onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                placeholder="Enter alias"
                disabled={isDisabled}
              />
            </div>
            {aliases.length > 1 && (
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
            )}
          </div>
        )}
      />
    ))}
    <FormField
      form={form}
      name="add-alias-placeholder"
      label=""
      render={() => (
        <Button
          id="add-alias-button"
          variant="outline-primary"
          size="sm"
          onClick={onAdd}
          type="button"
        >
          <i className="bi bi-plus-circle me-1" />
          {/**/}
          Add alias
        </Button>
      )}
    />
  </>
);
