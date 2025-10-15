import { FC, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import { gql } from "graphql-request";
import { PartyEditHeader } from "./party-edit-header";
import { CompSelect } from "@components/common/comp-select";
import { FormField } from "@components/common/form-field";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { useGraphQLQuery } from "@graphql/hooks/useGraphQLQuery";
import { useGraphQLMutation } from "@graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { PartyCreateInput, PartyUpdateInput } from "@/generated/graphql";
import { CompInput } from "@/app/components/common/comp-input";
import { selectPartyTypeDropdown } from "@/app/store/reducers/code-table-selectors";

const GET_PARTY = gql`
  query GetParty($partyIdentifier: String!) {
    party(partyIdentifier: $partyIdentifier) {
      __typename
      partyIdentifier
      partyTypeCode
      shortDescription
      longDescription
      createdDateTime
      person {
        personGuid
        firstName
        lastName
      }
      business {
        businessGuid
        name
      }
    }
  }
`;

const UPDATE_PARTY_MUTATION = gql`
  mutation UpdateParty($partyIdentifier: String!, $input: PartyUpdateInput!) {
    updateParty(partyIdentifier: $partyIdentifier, input: $input) {
      partyIdentifier
      partyTypeCode
      shortDescription
      longDescription
      createdDateTime
      person {
        personGuid
        firstName
        lastName
      }
      business {
        businessGuid
        name
      }
    }
  }
`;

const CREATE_PARTY_MUTATION = gql`
  mutation CreateParty($input: PartyCreateInput!) {
    createParty(input: $input) {
      partyIdentifier
      partyTypeCode
      shortDescription
      longDescription
      createdDateTime
      person {
        personGuid
        firstName
        lastName
      }
      business {
        businessGuid
        name
      }
    }
  }
`;
const PartyEdit: FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const dispatch = useAppDispatch();

  const partyTypes = useAppSelector(selectPartyTypeDropdown);

  const { data: partyData, isLoading } = useGraphQLQuery(GET_PARTY, {
    queryKey: ["party", id],
    variables: { partyIdentifier: id },
    enabled: isEditMode,
  });

  const partyTypeCodes = partyTypes
    ?.sort((left: any, right: any) => left.displayOrder - right.displayOrder)
    .map((code: any) => {
      return {
        value: code.value,
        label: code.label,
      };
    });

  const createPartyMutation = useGraphQLMutation(CREATE_PARTY_MUTATION, {
    onError: (error: any) => {
      console.error("Error creating party:", error);
      ToggleError("Failed to create party");
    },
    onSuccess: (data: any) => {
      ToggleSuccess("Party created successfully");
      navigate(`/party/${data.createParty.partyIdentifier}`);
    },
  });

  const updatePartyMutation = useGraphQLMutation(UPDATE_PARTY_MUTATION, {
    onSuccess: (data: any) => {
      ToggleSuccess("Party updated successfully");
      navigate(`/party/${id}`);
    },
    onError: (error: any) => {
      console.error("Error updating party:", error);
      ToggleError("Failed to update party");
    },
  });

  const defaultValues = useMemo(() => {
    if (isEditMode && partyData?.party) {
      return {
        partyType: partyData.party.partyTypeCode || "",
        firstName: partyData.party.person?.firstName || "",
        lastName: partyData.party.person?.lastName || "",
        businessName: partyData.party.business?.name || "",
      };
    }
    return {
      partyType: null,
      firstName: "",
      lastName: "",
      businessName: "",
    };
  }, [isEditMode, partyData]);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (isEditMode) {
        const updateInput: PartyUpdateInput = {
          partyTypeCode: value.partyType,
          business: value.partyType === "CMP" ? { name: value.businessName } : null,
          person: value.partyType === "PRS" ? { firstName: value.firstName, lastName: value.lastName } : null,
        };

        updatePartyMutation.mutate({
          partyIdentifier: id,
          input: updateInput,
        });
      } else {
        const createInput: PartyCreateInput = {
          partyTypeCode: value.partyType,
          business: value.partyType === "CMP" ? { name: value.businessName } : null,
          person: value.partyType === "PRS" ? { firstName: value.firstName, lastName: value.lastName } : null,
        };

        createPartyMutation.mutate({ input: createInput });
      }
    },
  });

  const partyTypeValue = useStore(form.store, (state) => state.values.partyType);

  const navigateToPartyList = () => {
    navigate(`/parties`);
  };

  const confirmCancelChanges = useCallback(() => {
    form.reset();

    if (isEditMode && id) {
      navigate(`/party/${id}`);
    } else {
      navigateToPartyList();
    }
  }, [navigate, isEditMode, id, form]);

  const cancelButtonClick = useCallback(() => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: confirmCancelChanges,
        },
      }),
    );
  }, [dispatch, confirmCancelChanges]);

  const saveButtonClick = useCallback(() => {
    form.handleSubmit();
  }, [form]);

  const isSubmitting = createPartyMutation.isPending || updatePartyMutation.isPending;
  const isDisabled = isSubmitting || isLoading;

  return (
    <div className="comp-complaint-details">
      <PartyEditHeader
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
        isEditMode={isEditMode}
        partyIdentifier={id}
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h2>Party Details</h2>
        </div>

        <form onSubmit={form.handleSubmit}>
          <fieldset disabled={isDisabled}>
            <FormField
              form={form}
              name="partyType"
              label="Party Type"
              required
              validators={{ onChange: z.string().min(1, "Party type is required") }}
              render={(field) => (
                <CompSelect
                  id="party-type-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={partyTypeCodes}
                  value={partyTypeCodes?.find((opt: any) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select party type"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                  isDisabled={isDisabled || isEditMode}
                />
              )}
            />
            {partyTypeValue === "PRS" && (
              <>
                <FormField
                  form={form}
                  name="firstName"
                  label="First name"
                  required
                  validators={{ onChange: z.string().min(1, "First name is required") }}
                  render={(field) => (
                    <CompInput
                      id="FirstName"
                      divid=""
                      type="input"
                      inputClass="comp-form-control comp-details-input"
                      defaultValue={field.state.value}
                      error={field.state.meta.errors?.[0]?.message || ""}
                      maxLength={50}
                      onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                      placeholder="Enter first name..."
                      disabled={isDisabled}
                    />
                  )}
                />
                <FormField
                  form={form}
                  name="lastName"
                  label="Last name"
                  required
                  validators={{ onChange: z.string().min(1, "Last name is required") }}
                  render={(field) => (
                    <CompInput
                      id="LastName"
                      divid=""
                      type="input"
                      inputClass="comp-form-control comp-details-input"
                      defaultValue={field.state.value}
                      error={field.state.meta.errors?.[0]?.message || ""}
                      maxLength={50}
                      onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                      placeholder="Enter last name..."
                      disabled={isDisabled}
                    />
                  )}
                />
              </>
            )}
            {partyTypeValue === "CMP" && (
              <FormField
                form={form}
                name="businessName"
                label="Name"
                required
                validators={{
                  onChange: z.string().min(1, "Name is required"),
                }}
                render={(field) => (
                  <CompInput
                    id="businessName"
                    divid=""
                    type="input"
                    inputClass="comp-form-control comp-details-input"
                    value={field.state.value}
                    error={field.state.meta.errors?.[0]?.message || ""}
                    maxLength={50}
                    onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                    placeholder="Enter name..."
                    disabled={isDisabled}
                  />
                )}
              />
            )}
          </fieldset>
        </form>
      </section>
    </div>
  );
};

export default PartyEdit;
