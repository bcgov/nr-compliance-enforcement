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

// heightWeightConversions.ts
// Canonical storage is centimetres (height) and kilograms (weight). These helpers
// convert between the canonical metric values and imperial display units.
// Display/entry only — the form and backend always work in cm/kg.

const CM_PER_INCH = 2.54;
const INCHES_PER_FOOT = 12;
const KG_PER_LB = 0.45359237;
const LB_PER_KG = 1 / KG_PER_LB; // 2.2046226218...

export interface FeetInches {
  feet: number;
  inches: number;
}

/** Centimetres to whole feet + inches (inches rounded, carrying 12 -> +1 foot). */
export function cmToFeetInches(cm: number): FeetInches {
  const totalInches = cm / CM_PER_INCH;
  let feet = Math.floor(totalInches / INCHES_PER_FOOT);
  let inches = Math.round(totalInches - feet * INCHES_PER_FOOT);
  if (inches === INCHES_PER_FOOT) {
    feet += 1;
    inches = 0;
  }
  return { feet, inches };
}

/** Feet + inches to centimetres, rounded to one decimal (matches numeric(5,1)). */
export function feetInchesToCm(feet: number, inches: number): number {
  const totalInches = feet * INCHES_PER_FOOT + inches;
  return Math.round(totalInches * CM_PER_INCH * 10) / 10;
}

/** Kilograms to whole pounds. */
export function kgToLb(kg: number): number {
  return Math.round(kg * LB_PER_KG);
}

/** Pounds to kilograms, rounded to one decimal (matches numeric(5,1)). */
export function lbToKg(lb: number): number {
  return Math.round(lb * KG_PER_LB * 10) / 10;
}
