import { useCallback } from "react";
import { useStore } from "@tanstack/react-form";

export const usePartyFormFields = (form: any, businessGuid?: string) => {
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
    setTimeout(() => {
      document.getElementById(`phone-number-${currentPhoneNumbers.length}`)?.focus();
    }, 0);
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
        isPrimary: currentEmails.length === 0,
      },
    ];
    form.setFieldValue("emailAddresses", newEmails);
    setTimeout(() => {
      document.getElementById(`email-${currentEmails.length}`)?.focus();
    }, 0);
  }, [form]);

  const handleRemoveEmail = useCallback(
    (indexToRemove: number) => {
      const currentEmails = form.getFieldValue("emailAddresses") || [];
      const removingPrimary = currentEmails[indexToRemove]?.isPrimary;
      const newEmails = currentEmails.filter((_: any, index: number) => index !== indexToRemove);

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

  // Aliases
  const aliases = useStore(form.store, (state: any) => state.values.aliases);

  const handleAddAlias = useCallback(() => {
    const currentAliases = form.getFieldValue("aliases") || [];
    const newAliases = [...currentAliases, { aliasGuid: crypto.randomUUID(), name: "" }];
    form.setFieldValue("aliases", newAliases);
    setTimeout(() => {
      document.getElementById(`alias-${currentAliases.length}`)?.focus();
    }, 0);
  }, [form]);

  const handleRemoveAlias = useCallback(
    (indexToRemove: number) => {
      const currentAliases = form.getFieldValue("aliases") || [];
      const newAliases = currentAliases.filter((_: any, index: number) => index !== indexToRemove);
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
        contactMethods: [],
      },
    };
    form.setFieldValue("contacts", [...currentContacts, newContact]);
    setTimeout(() => {
      document.getElementById(`contact-firstName-${currentContacts.length}`)?.focus();
    }, 0);
  }, [form]);

  const handleRemoveContact = useCallback(
    (indexToRemove: number) => {
      const currentContacts = form.getFieldValue("contacts") || [];
      const newContacts = currentContacts.filter((_: any, index: number) => index !== indexToRemove);
      form.setFieldValue("contacts", newContacts);
    },
    [form],
  );

  const handleAddContactMethod = useCallback(
    (contactIndex: number, typeCode: string) => {
      const currentContacts = form.getFieldValue("contacts") || [];

      const existingMethodsOfType =
        currentContacts[contactIndex]?.person?.contactMethods?.filter((cm: any) => cm?.typeCode === typeCode) || [];

      const newContactMethod = {
        contactMethodGuid: undefined,
        typeCode: typeCode,
        value: "",
        isPrimary: existingMethodsOfType.length === 0,
      };

      const updatedContacts = currentContacts.map((contact: any, index: number) => {
        const contactMethods = (contact.person?.contactMethods || [])
          .filter((cm: any) => cm != null)
          .map((cm: any) => ({
            contactMethodGuid: cm.contactMethodGuid,
            typeCode: cm.typeCode,
            value: cm.value,
            isPrimary: cm.isPrimary ?? false,
          }));

        return {
          businessPersonXrefGuid: contact.businessPersonXrefGuid,
          business: { businessGuid: contact.business?.businessGuid },
          person: {
            personGuid: contact.person?.personGuid,
            firstName: contact.person?.firstName,
            lastName: contact.person?.lastName,
            contactMethods: index === contactIndex ? [...contactMethods, newContactMethod] : contactMethods,
          },
        };
      });

      form.setFieldValue("contacts", updatedContacts);

      const fieldId =
        typeCode === "PHONE"
          ? `contact-phone-${contactIndex}-${existingMethodsOfType.length}`
          : `contact-email-${contactIndex}-${existingMethodsOfType.length}`;
      setTimeout(() => {
        document.getElementById(fieldId)?.focus();
      }, 0);
    },
    [form],
  );

  const handleRemoveContactMethod = useCallback(
    (contactIndex: number, methodIndex: number) => {
      const currentContacts = form.getFieldValue("contacts") || [];

      const updatedContacts = currentContacts.map((contact: any, index: number) => {
        const contactMethods = (contact.person?.contactMethods || []).filter((cm: any) => cm != null);

        let newContactMethods = contactMethods.map((cm: any) => ({
          contactMethodGuid: cm.contactMethodGuid,
          typeCode: cm.typeCode,
          value: cm.value,
          isPrimary: cm.isPrimary ?? false,
        }));

        if (index === contactIndex) {
          const methodToRemove = newContactMethods[methodIndex];
          const removingPrimary = methodToRemove?.isPrimary || false;
          const removingTypeCode = methodToRemove?.typeCode;
          newContactMethods = newContactMethods.filter((_: any, i: number) => i !== methodIndex);

          if (removingPrimary && removingTypeCode && newContactMethods.length > 0) {
            const firstOfSameType = newContactMethods.findIndex((cm: any) => cm?.typeCode === removingTypeCode);
            if (firstOfSameType !== -1) {
              newContactMethods[firstOfSameType] = {
                ...newContactMethods[firstOfSameType],
                isPrimary: true,
              };
            }
          }
        }

        return {
          businessPersonXrefGuid: contact.businessPersonXrefGuid,
          business: { businessGuid: contact.business?.businessGuid },
          person: {
            personGuid: contact.person?.personGuid,
            firstName: contact.person?.firstName,
            lastName: contact.person?.lastName,
            contactMethods: newContactMethods,
          },
        };
      });

      form.setFieldValue("contacts", updatedContacts);
    },
    [form],
  );

  const handleSetPrimaryContact = useCallback(
    (contactIndex: number, contactMethodIndex: number, contactMethodType: string) => {
      const currentContacts = form.getFieldValue("contacts") || [];
      const updatedContacts = currentContacts.map((c: any, cIndex: number) => ({
        businessPersonXrefGuid: c.businessPersonXrefGuid,
        business: { businessGuid: c.business?.businessGuid },
        person: {
          personGuid: c.person?.personGuid,
          firstName: c.person?.firstName,
          lastName: c.person?.lastName,
          contactMethods: (c.person?.contactMethods || [])
            .filter((cm: any) => cm != null)
            .map((cm: any, cmIdx: number) => ({
              contactMethodGuid: cm.contactMethodGuid,
              typeCode: cm.typeCode,
              value: cm.value,
              isPrimary:
                cIndex === contactIndex && cm?.typeCode === contactMethodType
                  ? cmIdx === contactMethodIndex
                  : (cm.isPrimary ?? false),
            })),
        },
      }));
      form.setFieldValue("contacts", updatedContacts);
    },
    [form],
  );

  return {
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
  };
};
