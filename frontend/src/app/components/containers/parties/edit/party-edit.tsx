import { FC, useCallback, useMemo, useRef, useState } from "react";
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
import { BusinessIdentifier, ImageUpdateInput, PartyUpdateInput, PersonFacialHairStyleCode } from "@/generated/graphql";
import { selectPartyTypeDropdown } from "@/app/store/reducers/code-table-selectors";
import { GET_PARTY } from "@/app/components/containers/parties/view/party-view";
import { parse } from "date-fns";
import useUnsavedChangesWarning from "@/app/hooks/use-unsaved-changes-warning";
import { ContactMethods } from "@/app/constants/contact-methods";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";
import { PartyTypeCodes } from "@/app/constants/party-types";
import { PersonForm } from "@/app/components/containers/parties/form/person-form";
import { BusinessFormFields } from "@/app/components/containers/parties/form/business-form";
import {
  buildAddresses,
  buildAliases,
  buildBusinessCreateUpdate,
  buildContactMethods,
  buildContactPeople,
  buildExternalIds,
  buildPersonForUpdate,
  mapAddressesFromPartyData,
  mapAliasesFromPartyData,
  mapExternalIdsFromPartyData,
  mapContactMethodsFromPartyData,
  mapContactPeopleFromPartyData,
  validateBusinessForm,
  PartyExternalIdFormValue,
  createEmptyContactMethod,
} from "@/app/components/containers/parties/form/party-form-utils";
import {
  handleBusinessPartyMutationError,
  scrollToFirstFieldError,
} from "@/app/components/containers/parties/form/party-form-errors";
import { PARTY_DUPLICATE_MESSAGE } from "@/app/components/containers/parties/form/party-unique-fields";
import { useUniqueFieldCheck } from "@/app/components/containers/parties/hooks/use-unique-field-check";
import { PartyAttachments } from "../attachments/party-attachments";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { FormErrorBanner } from "@/app/components/common/form-error-banner";
import { getPartyName } from "@/app/common/party-name";
import { isYoungPerson } from "@/app/common/methods";
import { PartyBadges } from "@/app/components/containers/parties/party-badges";

const PARTY_PERSON_FRAGMENT = gql`
  fragment PartyPersonFields on Person {
    personGuid
    firstName
    middleNames
    lastName
    dateOfBirth
    approximateAgeCode
    driversLicenseNumber
    driversLicenseClass
    driversLicenseCountryCode
    driversLicenseCountrySubdivisionCode
  }
`;

const UPDATE_PARTY_MUTATION = gql`
  ${PARTY_PERSON_FRAGMENT}
  mutation UpdateParty($partyIdentifier: String!, $input: PartyUpdateInput!) {
    updateParty(partyIdentifier: $partyIdentifier, input: $input) {
      partyIdentifier
      partyTypeCode
      shortDescription
      longDescription
      createdDateTime
      person {
        ...PartyPersonFields
      }
      business {
        businessGuid
        name
      }
    }
  }
`;

const parseDateOnly = (dateStr: string) => parse(dateStr.slice(0, 10), "yyyy-MM-dd", new Date());

const PartyEdit: FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const partyTypes = useAppSelector(selectPartyTypeDropdown);

  const { data: partyData, isLoading } = useGraphQLQuery(GET_PARTY, {
    queryKey: ["party", id],
    variables: { partyIdentifier: id },
  });

  const partyTypeCodes = partyTypes
    ?.toSorted((left: any, right: any) => left.displayOrder - right.displayOrder)
    .filter((party) => [PartyTypeCodes.PERSON, PartyTypeCodes.ORGANIZATION].includes(party.value))
    .map((code: any) => {
      return {
        value: code.value,
        label: code.label,
      };
    });

  const defaultValues = useMemo(() => {
    if (partyData?.party) {
      const person = partyData.party.person;
      return {
        partyType: partyData.party.partyTypeCode || "",
        personGuid: person?.personGuid || "",
        firstName: person?.firstName || "",
        middleNames: person?.middleNames || "",
        lastName: person?.lastName || "",
        dateOfBirth: person?.dateOfBirth ? parseDateOnly(String(person.dateOfBirth)) : null,
        approximateAgeCode: person?.approximateAgeCode || "",
        driversLicenseNumber: person?.driversLicenseNumber || null,
        driversLicenseClass: person?.driversLicenseClass || null,
        driversLicenseCountryCode: person?.driversLicenseCountryCode || null,
        driversLicenseCountrySubdivisionCode: person?.driversLicenseCountrySubdivisionCode || null,
        genderCode: person?.genderCode || "",
        sexCode: person?.sexCode || "",
        heightInCm: person?.heightInCm || null,
        weightInKg: person?.weightInKg || null,
        complexionCode: person?.complexionCode || "",
        buildCode: person?.buildCode || "",
        hairColourCode: person?.hairColourCode || "",
        hairLengthCode: person?.hairLengthCode || "",
        hairColourOther: person?.hairColourOther || null,
        eyeColourCode: person?.eyeColourCode || "",
        eyeColourOther: person?.eyeColourOther || null,
        facialHairIndicator: person?.facialHairIndicator || null,
        facialHairStyleCodes:
          person?.facialHairStyleCodes?.map((fhs: PersonFacialHairStyleCode) => ({
            personFacialStyleHairCodeGuid: fhs.personFacialStyleHairCodeGuid,
            personGuid: fhs.personGuid,
            facialHairStyleCode: fhs.facialHairStyleCode,
          })) ?? [],
        additionalHairDescriptors: person?.additionalHairDescriptors || null,
        tattooIndicator: person?.tattooIndicator || null,
        tattooDescription: person?.tattooDescription || null,
        additionalDescriptors: person?.additionalDescriptors || null,
        comments: person?.comments || null,
        safetyConcernIndicator: person?.safetyConcernIndicator || null,
        safetyConcernReason: person?.safetyConcernReason || null,
        businessSafetyConcernIndicator: partyData.party.business?.safetyConcernIndicator || null,
        businessSafetyConcernReason: partyData.party.business?.safetyConcernReason || null,
        businessName: partyData.party.business?.name || "",
        businessNumber: partyData.party.business?.businessIdentifiers?.find(
          (i: BusinessIdentifier) => i.identifierCode === BusinessIdentifiers.BUSINESS_NUMBER,
        ),
        worksafeBCNumber: partyData.party.business?.businessIdentifiers?.find(
          (i: BusinessIdentifier) => i.identifierCode === BusinessIdentifiers.WSBC_NUMBER,
        ),
        aliases: mapAliasesFromPartyData(partyData.party.aliases),
        externalIds: mapExternalIdsFromPartyData(partyData.party.externalIds),
        phoneNumbers: mapContactMethodsFromPartyData(partyData.party.contactMethods, ContactMethods.PHONE),
        emailAddresses: mapContactMethodsFromPartyData(partyData.party.contactMethods, ContactMethods.EMAIL),
        contacts: mapContactPeopleFromPartyData(partyData.party.business?.contactPeople),
        addresses: mapAddressesFromPartyData(partyData.party.addresses),
      };
    }
    return {
      partyType: null,
      personGuid: "",
      firstName: "",
      middleNames: "",
      lastName: "",
      dateOfBirth: null,
      approximateAgeCode: "",
      driversLicenseNumber: "",
      driversLicenseClass: "",
      driversLicenseCountryCode: "",
      driversLicenseCountrySubdivisionCode: "",
      genderCode: "",
      sexCode: "",
      heightInCm: null,
      weightInKg: null,
      complexionCode: "",
      buildCode: "",
      hairColourCode: "",
      hairLengthCode: "",
      hairColourOther: "",
      eyeColourCode: "",
      eyeColourOther: "",
      facialHairIndicator: "",
      facialHairStyleCodes: [],
      additionalHairDescriptors: "",
      safetyConcernIndicator: "",
      safetyConcernReason: "",
      comments: "",
      tattooIndicator: "",
      tattooDescription: "",
      additionalDescriptors: "",
      businessSafetyConcernIndicator: "" as any,
      businessSafetyConcernReason: "",
      businessName: "",
      businessNumber: {},
      worksafeBCNumber: {},
      aliases: [{ aliasGuid: undefined, name: "" }],
      externalIds: [] as PartyExternalIdFormValue[],
      phoneNumbers: [createEmptyContactMethod(true)],
      emailAddresses: [createEmptyContactMethod(true)],
      contacts: [],
      addresses: [],
    };
  }, [partyData]);

  const [attachmentsDirty, setAttachmentsDirty] = useState(false);
  const [triggerSaveAttachments, setTriggerSaveAttachments] = useState(0);
  const [triggerCancelAttachments, setTriggerCancelAttachments] = useState(0);
  const pendingImagesRef = useRef<ImageUpdateInput[]>([]);

  const form = useForm({
    defaultValues,
    // fires only when a submission attempt is blocked by validation
    onSubmitInvalid: () => scrollToFirstFieldError(),
    onSubmit: async ({ value }) => {
      if (value.partyType === PartyTypeCodes.ORGANIZATION) {
        const validationError = await validateBusinessForm(value);
        if (validationError) {
          ToggleError(validationError);
          return;
        }
      }

      const updateInput: PartyUpdateInput = {
        partyTypeCode: value.partyType,
        addresses: buildAddresses(value.addresses),
        contactMethods: buildContactMethods(value.phoneNumbers, value.emailAddresses, true),
        aliases: buildAliases(value.aliases, true),
        externalIds: buildExternalIds(value.externalIds, true),
        images: pendingImagesRef.current,
        business:
          value.partyType === "ORG" ? buildBusinessCreateUpdate(value, buildContactPeople(value.contacts, true)) : null,
        person: value.partyType === "PRS" ? buildPersonForUpdate(value) : null,
      };
      updatePartyMutation.mutate({ partyIdentifier: id, input: updateInput });
    },
  });

  const { uniqueFieldConflict, checkUniqueFieldConflicts, handleDuplicateIdentifierError } = useUniqueFieldCheck(
    form,
    id,
  );

  const updatePartyMutation = useGraphQLMutation(UPDATE_PARTY_MUTATION, {
    onSuccess: (data: any) => {
      ToggleSuccess("Party updated successfully");
      allowNavigation();
      navigate(`/party/${id}`);
    },
    onError: (error: any) => {
      console.error("Error updating party:", error);
      if (handleDuplicateIdentifierError(error)) return;
      handleBusinessPartyMutationError(form, error, "Failed to update party");
    },
  });

  const isDirty =
    useStore(form.baseStore, (state) => Object.values(state.fieldMetaBase).some((field) => field?.isTouched)) ||
    attachmentsDirty;
  const { allowNavigation } = useUnsavedChangesWarning(isDirty);

  const partyTypeValue = useStore(form.store, (state) => state.values.partyType);
  const currentFormValues = useStore(form.store, (state) => state.values);

  const navigateToPartyList = () => {
    allowNavigation();
    navigate(`/parties`);
  };

  const handlePendingImagesChange = useCallback((images: ImageUpdateInput[]) => {
    pendingImagesRef.current = images;
  }, []);

  const confirmCancelChanges = useCallback(() => {
    setTriggerCancelAttachments((n) => n + 1);
    setTimeout(() => {
      form.reset();
      allowNavigation();
      if (id) {
        navigate(`/party/${id}`);
      } else {
        navigateToPartyList();
      }
    }, 0);
  }, [navigate, id, form]);

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

  const saveButtonClick = useCallback(async () => {
    const currentValues = currentFormValues;
    if (currentValues.partyType === PartyTypeCodes.ORGANIZATION) {
      const validationError = await validateBusinessForm(currentValues);
      if (validationError) {
        ToggleError(validationError);
        return;
      }
    }

    if (await checkUniqueFieldConflicts()) {
      return;
    }

    setTriggerSaveAttachments((n) => n + 1);
    setTimeout(() => {
      form.handleSubmit();
    }, 0);
  }, [form, partyData, currentFormValues, checkUniqueFieldConflicts]);

  const isSubmitting = updatePartyMutation.isPending;
  const isDisabled = isSubmitting || isLoading;
  // disable saving from validation start through mutation completion
  const formSubmitting = useStore(form.store, (state: any) => state.isSubmitting) as boolean;
  const saveDisabled = formSubmitting || isDisabled;

  const handleAttachmentsDirtyChange = (_index: number, dirty: boolean) => {
    setAttachmentsDirty(dirty);
  };

  const personDob = partyData?.party?.person?.dateOfBirth ? new Date(partyData.party?.person.dateOfBirth) : null;
  const personIsYoung = partyData?.party?.person
    ? isYoungPerson(personDob, partyData.party.person.approximateAgeCode)
    : false;

  return (
    <div className="comp-complaint-details">
      <PartyEditHeader
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
        saveDisabled={saveDisabled}
        isEditMode={true}
        partyName={partyData?.party ? getPartyName(partyData?.party) : ""}
        partyIdentifier={id}
        badges={
          <PartyBadges
            isSafetyConcern={
              !!(partyData?.party?.person?.safetyConcernIndicator || partyData?.party?.business?.safetyConcernIndicator)
            }
            isYoungPerson={personIsYoung}
          />
        }
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h3>Identifying information</h3>
        </div>
        <FormErrorBanner
          form={form}
          errorMessage={uniqueFieldConflict ? PARTY_DUPLICATE_MESSAGE : undefined}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!saveDisabled) saveButtonClick();
          }}
        >
          <fieldset disabled={isDisabled}>
            <FormField
              form={form}
              name="partyType"
              label="Type"
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
                  isDisabled={true}
                />
              )}
            />
            {partyTypeValue === "PRS" && (
              <PersonForm
                form={form}
                isDisabled={isDisabled}
                isPublished={true}
              />
            )}
            {partyTypeValue === "ORG" && (
              <BusinessFormFields
                form={form}
                isDisabled={isDisabled}
                showContactPeople={true}
                showInvestigationFields={true}
                businessGuid={partyData?.party?.business?.businessGuid}
              />
            )}
          </fieldset>

          {partyTypeValue && (
            <>
              <div className="comp-details-section-header pt-5">
                <h3>Attachments</h3>
              </div>
              <PartyAttachments
                partyId={id ?? ""}
                attachmentType={AttachmentEnum.PARTY_ATTACHMENT}
                allowUpload
                allowDelete
                triggerSave={triggerSaveAttachments}
                triggerCancel={triggerCancelAttachments}
                onPendingImagesChange={handlePendingImagesChange}
                onDirtyChange={(index: number, isDirty: boolean) => handleAttachmentsDirtyChange(index, isDirty)}
              />
            </>
          )}
        </form>
      </section>
    </div>
  );
};

export default PartyEdit;
