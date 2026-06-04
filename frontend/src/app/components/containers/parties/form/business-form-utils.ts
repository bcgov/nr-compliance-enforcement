export type AddressFormValue = {
  addressGuid?: string;
  addressName?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  isPrimary?: boolean;
};

export const createEmptyAddress = (): AddressFormValue => ({
  addressName: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  country: "",
  isPrimary: false,
});
