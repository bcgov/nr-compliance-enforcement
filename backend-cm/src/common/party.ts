export interface PersonDto {
  personGuid: string;
  partyGuid: string;
  firstName: string;
  middleName?: string;
  middleName2?: string;
  lastName: string;
}

export interface BusinessDto {
  businessGuid: string;
  name: string;
  partyGuid: string;
}

export interface PartyDto {
  partyIdentifier: string;
  partyTypeCode: string;
  person?: PersonDto;
  business?: BusinessDto;
  partyAssociationRole?: string;
}

export const PARTY_TYPES = {
  Person: "PRS",
  Company: "CMP",
  Contact: "CNT",
};
