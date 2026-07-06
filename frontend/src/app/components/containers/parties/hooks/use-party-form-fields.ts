import { useCallback } from "react";
import { useStore } from "@tanstack/react-form";
import { Alias, BusinessPerson, ContactMethod } from "@/generated/graphql";
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

  // Phone numbers
  const phoneNumbers = useStore(form.store, (state: any) => state.values.phoneNumbers);

  const handleAddPhoneNumber = useCallback(() => {
    const currentPhoneNumbers = form.getFieldValue("phoneNumbers") || [];
    const newPhoneNumbers = [
      ...currentPhoneNumbers,
      {
        contactMethodGuid: "",
        value: "",
        isPrimary: currentPhoneNumbers.length === 0,
      },
    ];
    form.setFieldValue("phoneNumbers", newPhoneNumbers);
    focusFieldById(`phone-number-${currentPhoneNumbers.length}`);
  }, [form]);

  const handleRemovePhoneNumber = useCallback(
    (indexToRemove: number) => {
      const currentPhoneNumbers = form.getFieldValue("phoneNumbers") || [];
      const removingPrimary = currentPhoneNumbers[indexToRemove]?.isPrimary;
      const newPhoneNumbers = currentPhoneNumbers.filter((_: any, index: number) => index !== indexToRemove);

      if (removingPrimary && newPhoneNumbers.length > 0) {
        newPhoneNumbers[0].isPrimary = true;
      }

      form.setFieldValue("phoneNumbers", newPhoneNumbers);
    },
    [form],
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
    const newEmails = [
      ...currentEmails,
      {
        contactMethodGuid: "",
        value: "",
        isPrimary: currentEmails.length === 0, // First one is primary
      },
    ];
    form.setFieldValue("emailAddresses", newEmails);
    focusFieldById(`email-${currentEmails.length}`);
  }, [form]);

  const handleRemoveEmail = useCallback(
    (indexToRemove: number) => {
      const currentEmails = form.getFieldValue("emailAddresses") || [];
      const removingPrimary = currentEmails[indexToRemove]?.isPrimary;
      const newEmails = currentEmails.filter((_: any, index: number) => index !== indexToRemove);

      // If we removed the primary phone and there are still phone numbers left,
      // make the first one primary
      if (removingPrimary && newEmails.length > 0) {
        newEmails[0].isPrimary = true;
      }

      form.setFieldValue("emailAddresses", newEmails);
    },
    [form],
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
    const newAddresses = [
      ...currentAddresses,
      {
        ...createEmptyAddress(),
        isPrimary: currentAddresses.length === 0,
      },
    ];
    form.setFieldValue("addresses", newAddresses);
    focusFieldById(`business-address-name-${currentAddresses.length}`);
  }, [form, focusFieldById]);

  const handleRemoveAddress = useCallback(
    (indexToRemove: number) => {
      const currentAddresses = form.getFieldValue("addresses") || [];
      const removingPrimary = currentAddresses[indexToRemove]?.isPrimary;
      const newAddresses = currentAddresses.filter((_: AddressFormValue, index: number) => index !== indexToRemove);

      if (removingPrimary && newAddresses.length > 0) {
        newAddresses[0].isPrimary = true;
      }

      form.setFieldValue("addresses", newAddresses);
    },
    [form],
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
    const newAliases = [...currentAliases, { aliasGuid: undefined, name: "" }];
    form.setFieldValue("aliases", newAliases);
    focusFieldById(`alias-${currentAliases.length}`);
  }, [form]);

  const handleRemoveAlias = useCallback(
    (indexToRemove: number) => {
      const currentAliases = form.getFieldValue("aliases") || [];
      const newAliases = currentAliases.filter((_: Alias, index: number) => index !== indexToRemove);
      form.setFieldValue("aliases", newAliases);
    },
    [form],
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
    form.setFieldValue("contacts", [...currentContacts, newContact]);
    focusFieldById(`contact-firstName-${currentContacts.length}`);
  }, [form]);

  const handleRemoveContact = useCallback(
    (indexToRemove: number) => {
      const currentContacts = form.getFieldValue("contacts") || [];
      const newContacts = currentContacts.filter((_: BusinessPerson, index: number) => index !== indexToRemove);
      form.setFieldValue("contacts", newContacts);
    },
    [form],
  );

  const handleAddContactMethod = useCallback(
    (contactIndex: number, typeCode: string) => {
      const currentContacts = form.getFieldValue("contacts") || [];

      // Check if this will be the first contact method of this type for this contact
      const existingMethodsOfType =
        currentContacts[contactIndex]?.contactMethods?.filter((cm: ContactMethod) => cm?.typeCode === typeCode) || [];

      const newContactMethod = {
        contactMethodGuid: undefined, // ← Should be undefined, not empty string
        typeCode: typeCode,
        value: "",
        isPrimary: existingMethodsOfType.length === 0, // First one is primary
      };

      const updatedContacts = currentContacts.map((contact: BusinessPerson, index: number) => {
        const snapshot = toContactSnapshot(contact);
        if (index === contactIndex) {
          return {
            ...snapshot,
            contactMethods: [...snapshot.contactMethods, newContactMethod],
          };
        }
        return snapshot;
      });

      form.setFieldValue("contacts", updatedContacts);

      const fieldId =
        typeCode === ContactMethods.PHONE
          ? `contact-phone-${contactIndex}-${existingMethodsOfType.length}`
          : `contact-email-${contactIndex}-${existingMethodsOfType.length}`;
      focusFieldById(fieldId);
    },
    [form],
  );

  const handleRemoveContactMethod = useCallback(
    (contactIndex: number, methodIndex: number) => {
      const currentContacts = form.getFieldValue("contacts") || [];

      const updatedContacts = currentContacts.map((contact: BusinessPerson, index: number) => {
        const snapshot = toContactSnapshot(contact);
        if (index === contactIndex) {
          const contactMethods = snapshot.contactMethods;

          const methodToRemove = contactMethods[methodIndex];
          const removingPrimary = methodToRemove?.isPrimary || false;
          const removingTypeCode = methodToRemove?.typeCode;
          let newContactMethods = contactMethods.filter((_, i) => i !== methodIndex);

          // If we removed the primary method and there are still methods of the same type left,
          // make the first one of that type primary
          if (removingPrimary && removingTypeCode && newContactMethods.length > 0) {
            const firstOfSameType = newContactMethods.findIndex((cm) => cm?.typeCode === removingTypeCode);
            if (firstOfSameType !== -1) {
              newContactMethods[firstOfSameType] = {
                ...newContactMethods[firstOfSameType],
                isPrimary: true,
              };
            }
          }

          return {
            ...snapshot,
            contactMethods: newContactMethods,
          };
        }
        return snapshot;
      });

      form.setFieldValue("contacts", updatedContacts);
    },
    [form],
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
