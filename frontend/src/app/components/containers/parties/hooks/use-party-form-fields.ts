import { useCallback } from "react";
import { useStore } from "@tanstack/react-form";
import { BusinessPerson, ContactMethod } from "@/generated/graphql";
import { ContactMethods } from "@/app/constants/contact-methods";
import {
  AddressFormValue,
  createEmptyAddress,
  seedContactMethods,
} from "@/app/components/containers/parties/form/party-form-utils";

const toContactSnapshot = (contact: BusinessPerson) => ({
  businessPersonXrefGuid: contact.businessPersonXrefGuid,
  business: { businessGuid: contact.business?.businessGuid },
  person: {
    personGuid: contact.person?.personGuid,
    firstName: contact.person?.firstName,
    lastName: contact.person?.lastName,
  },
  contactMethods: (contact.contactMethods || [])
    .filter((cm): cm is ContactMethod => cm != null)
    .map((cm) => ({
      contactMethodGuid: cm.contactMethodGuid,
      typeCode: cm.typeCode,
      value: cm.value,
      isPrimary: cm.isPrimary ?? false, // adds default
    })),
  title: contact.title ?? "",
  displayInInvestigation: contact.displayInInvestigation ?? true,
  isPrimary: contact.isPrimary ?? false,
  officeAddressGuids: ((contact as any).officeAddressGuids ?? []) as string[],
});

export const usePartyFormFields = (form: any, businessGuid?: string) => {
  const focusFieldById = useCallback((fieldId: string) => {
    setTimeout(() => {
      document.getElementById(fieldId)?.focus();
    }, 0);
  }, []);

  // validation is conditional based on number of items, so we must re-validate the whole list after adding or removing
  const revalidateList = useCallback(
    (listName: string) => {
      form.validateArrayFieldsStartingFrom(listName, 0, "change");
    },
    [form],
  );

  // Phone numbers
  const phoneNumbers = useStore(form.store, (state: any) => state.values.phoneNumbers);

  const handleAddPhoneNumber = useCallback(() => {
    const currentPhoneNumbers = form.getFieldValue("phoneNumbers") || [];
    form.pushFieldValue("phoneNumbers", {
      contactMethodGuid: "",
      value: "",
      isPrimary: currentPhoneNumbers.length === 0,
    });
    revalidateList("phoneNumbers");
    focusFieldById(`phone-number-${currentPhoneNumbers.length}`);
  }, [form, focusFieldById, revalidateList]);

  const handleRemovePhoneNumber = useCallback(
    (indexToRemove: number) => {
      const currentPhoneNumbers = form.getFieldValue("phoneNumbers") || [];
      const removingPrimary = currentPhoneNumbers[indexToRemove]?.isPrimary;

      form.removeFieldValue("phoneNumbers", indexToRemove);
      if (removingPrimary && (form.getFieldValue("phoneNumbers") || []).length > 0) {
        form.setFieldValue("phoneNumbers[0].isPrimary", true);
      }
      revalidateList("phoneNumbers");
    },
    [form, revalidateList],
  );

  const handleSetPrimaryPhoneNumber = useCallback(
    (index: number) => {
      const currentPhoneNumbers = form.getFieldValue("phoneNumbers") || [];
      const updatedPhones = currentPhoneNumbers.map((p: any, i: number) => ({
        ...p,
        isPrimary: i === index,
      }));
      form.setFieldValue("phoneNumbers", updatedPhones);
    },
    [form],
  );

  // Email addresses
  const emailAddresses = useStore(form.store, (state: any) => state.values.emailAddresses);

  const handleAddEmail = useCallback(() => {
    const currentEmails = form.getFieldValue("emailAddresses") || [];
    form.pushFieldValue("emailAddresses", {
      contactMethodGuid: "",
      value: "",
      isPrimary: currentEmails.length === 0, // First one is primary
    });
    revalidateList("emailAddresses");
    focusFieldById(`email-${currentEmails.length}`);
  }, [form, focusFieldById, revalidateList]);

  const handleRemoveEmail = useCallback(
    (indexToRemove: number) => {
      const currentEmails = form.getFieldValue("emailAddresses") || [];
      const removingPrimary = currentEmails[indexToRemove]?.isPrimary;

      form.removeFieldValue("emailAddresses", indexToRemove);
      // if the removed email was primary, make the first remaining one primary
      if (removingPrimary && (form.getFieldValue("emailAddresses") || []).length > 0) {
        form.setFieldValue("emailAddresses[0].isPrimary", true);
      }
      revalidateList("emailAddresses");
    },
    [form, revalidateList],
  );

  const handleSetPrimaryEmail = useCallback(
    (index: number) => {
      const currentEmailAddresses = form.getFieldValue("emailAddresses") || [];
      const updatedEmailAddresses = currentEmailAddresses.map((p: any, i: number) => ({
        ...p,
        isPrimary: i === index,
      }));
      form.setFieldValue("emailAddresses", updatedEmailAddresses);
    },
    [form],
  );

  // Addresses
  const addresses = useStore(form.store, (state: any) => state.values.addresses);

  const handleAddAddress = useCallback(() => {
    const currentAddresses = form.getFieldValue("addresses") || [];
    form.pushFieldValue("addresses", {
      ...createEmptyAddress(),
      isPrimary: currentAddresses.length === 0,
    });
    revalidateList("addresses");
    focusFieldById(`business-address-name-${currentAddresses.length}`);
  }, [form, focusFieldById, revalidateList]);

  const handleRemoveAddress = useCallback(
    (indexToRemove: number) => {
      const currentAddresses = form.getFieldValue("addresses") || [];
      const removingPrimary = currentAddresses[indexToRemove]?.isPrimary;

      form.removeFieldValue("addresses", indexToRemove);
      if (removingPrimary && (form.getFieldValue("addresses") || []).length > 0) {
        form.setFieldValue("addresses[0].isPrimary", true);
      }
      revalidateList("addresses");
    },
    [form, revalidateList],
  );

  const handleSetPrimaryAddress = useCallback(
    (index: number) => {
      const currentAddresses = form.getFieldValue("addresses") || [];
      const updatedAddresses = currentAddresses.map((address: AddressFormValue, i: number) => ({
        ...address,
        isPrimary: i === index,
      }));
      form.setFieldValue("addresses", updatedAddresses);
    },
    [form],
  );

  // Aliases
  const aliases = useStore(form.store, (state: any) => state.values.aliases);

  const handleAddAlias = useCallback(() => {
    const currentAliases = form.getFieldValue("aliases") || [];
    form.pushFieldValue("aliases", { aliasGuid: undefined, name: "" });
    revalidateList("aliases");
    focusFieldById(`alias-${currentAliases.length}`);
  }, [form, focusFieldById, revalidateList]);

  const handleRemoveAlias = useCallback(
    (indexToRemove: number) => {
      form.removeFieldValue("aliases", indexToRemove);
      revalidateList("aliases");
    },
    [form, revalidateList],
  );

  // Contacts (business person xrefs)
  const contacts = useStore(form.store, (state: any) => state.values.contacts);

  const handleAddContact = useCallback(() => {
    const currentContacts = form.getFieldValue("contacts") || [];
    const newContact = {
      businessPersonXrefGuid: undefined,
      business: {
        businessGuid: businessGuid || "",
      },
      person: {
        personGuid: "",
        firstName: "",
        lastName: "",
      },
      contactMethods: seedContactMethods(),
      title: "",
      displayInInvestigation: true,
      isPrimary: currentContacts.length === 0,
      officeAddressGuids: [] as string[],
    };
    form.pushFieldValue("contacts", newContact);
    revalidateList("contacts");
    focusFieldById(`contact-firstName-${currentContacts.length}`);
  }, [form, businessGuid, focusFieldById, revalidateList]);

  const handleRemoveContact = useCallback(
    (indexToRemove: number) => {
      const currentContacts = form.getFieldValue("contacts") || [];
      const isCurrentPrimary = currentContacts[indexToRemove]?.isPrimary;

      form.removeFieldValue("contacts", indexToRemove);
      // if the removed contact was the primary contact make the next contact the primary contact
      if (isCurrentPrimary && (form.getFieldValue("contacts") || []).length > 0) {
        form.setFieldValue("contacts[0].isPrimary", true);
      }
      revalidateList("contacts");
    },
    [form, revalidateList],
  );

  const handleAddContactMethod = useCallback(
    (contactIndex: number, typeCode: string) => {
      const currentContacts = form.getFieldValue("contacts") || [];

      // Check if this will be the first contact method of this type for this contact
      const existingMethodsOfType =
        currentContacts[contactIndex]?.contactMethods?.filter((cm: ContactMethod) => cm?.typeCode === typeCode) || [];

      form.pushFieldValue(`contacts[${contactIndex}].contactMethods`, {
        contactMethodGuid: undefined, // ← Should be undefined, not empty string
        typeCode: typeCode,
        value: "",
        isPrimary: existingMethodsOfType.length === 0, // First one is primary
      });
      revalidateList("contacts");

      const fieldId =
        typeCode === ContactMethods.PHONE
          ? `contact-phone-${contactIndex}-${existingMethodsOfType.length}`
          : `contact-email-${contactIndex}-${existingMethodsOfType.length}`;
      focusFieldById(fieldId);
    },
    [form, focusFieldById, revalidateList],
  );

  const handleRemoveContactMethod = useCallback(
    (contactIndex: number, methodIndex: number) => {
      const methodsPath = `contacts[${contactIndex}].contactMethods`;
      const methodToRemove = (form.getFieldValue(methodsPath) || [])[methodIndex];

      form.removeFieldValue(methodsPath, methodIndex);

      // If we removed the primary method and there are still methods of the same type left,
      // make the first one of that type primary
      if (methodToRemove?.isPrimary && methodToRemove?.typeCode) {
        const remaining = form.getFieldValue(methodsPath) || [];
        const firstOfSameType = remaining.findIndex((cm: ContactMethod) => cm?.typeCode === methodToRemove.typeCode);
        if (firstOfSameType !== -1) {
          form.setFieldValue(`${methodsPath}[${firstOfSameType}].isPrimary`, true);
        }
      }
      revalidateList("contacts");
    },
    [form, revalidateList],
  );

  const handleSetPrimaryBusinessContact = useCallback(
    (index: number) => {
      const currentContacts = form.getFieldValue("contacts") || [];
      const updatedContacts = currentContacts.map((c: BusinessPerson, i: number) => ({
        ...c,
        isPrimary: i === index,
      }));
      form.setFieldValue("contacts", updatedContacts);
    },
    [form],
  );

  const handleSetPrimaryContact = useCallback(
    (contactIndex: number, contactMethodIndex: number, contactMethodType: string) => {
      const currentContacts = form.getFieldValue("contacts") || [];
      const updatedContacts = currentContacts.map((c: BusinessPerson, cIndex: number) => {
        const snapshot = toContactSnapshot(c);
        if (cIndex === contactIndex) {
          return {
            ...snapshot,
            contactMethods: snapshot.contactMethods.map((cm, cmIdx) => ({
              ...cm,
              isPrimary: cm.typeCode === contactMethodType ? cmIdx === contactMethodIndex : cm.isPrimary,
            })),
          };
        }
        return snapshot;
      });
      form.setFieldValue("contacts", updatedContacts);
    },
    [form],
  );

  return {
    addresses,
    handleAddAddress,
    handleRemoveAddress,
    handleSetPrimaryAddress,
    phoneNumbers,
    handleAddPhoneNumber,
    handleRemovePhoneNumber,
    handleSetPrimaryPhoneNumber,
    emailAddresses,
    handleAddEmail,
    handleRemoveEmail,
    handleSetPrimaryEmail,
    aliases,
    handleAddAlias,
    handleRemoveAlias,
    contacts,
    handleAddContact,
    handleRemoveContact,
    handleAddContactMethod,
    handleRemoveContactMethod,
    handleSetPrimaryContact,
    handleSetPrimaryBusinessContact,
  };
};
