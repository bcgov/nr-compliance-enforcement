export type BusinessAddressFormValue = {
  businessAddressGuid?: string;
  addressName?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  isPrimary?: boolean;
};

export const createEmptyAddress = (): BusinessAddressFormValue => ({
  addressName: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  country: "",
  isPrimary: false,
});
