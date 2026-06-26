import { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PartyHeader } from "./party-header";
import { PartyTabs } from "./party-tabs";
import { PartyHistoryTab } from "./party-history-tab";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { Party, Person, ContactMethod, Address } from "@/generated/graphql";
import { Badge, Button } from "react-bootstrap";
import { PartyCarousel } from "@/app/components/containers/parties/attachments/party-carousel";
import { PartyTypes } from "@/app/constants/party-types";
import {
  selectApproximateAgeDropdown,
  selectBuildDropdown,
  selectComplexionDropdown,
  selectEyeColourDropdown,
  selectFacialHairStyleDropdown,
  selectGenderDropdown,
  selectHairColourDropdown,
  selectHairLengthDropdown,
} from "@/app/store/reducers/code-table";
import { useAppSelector } from "@/app/hooks/hooks";
import Option from "@apptypes/app/option";
import { formatPhoneNumber } from "react-phone-number-input/input";
import { calculateAgeYears, formatDateOfBirth, isYoungPerson } from "@common/methods";
import { ContactMethods } from "@/app/constants/contact-methods";
import { selectCountries, selectCountrySubdivisions } from "@/app/store/reducers/code-table-selectors";
import { cmToFeetInches, kgToLb } from "@/app/components/containers/parties/form/party-form-utils";
import { BUSINESS_IDENTIFIER_LABELS } from "@/app/constants/business-identifiers";
import { PartyComplianceHistory } from "@/app/components/containers/parties/view/compliance-history/party-compliance-history";

export const GET_PARTY = gql`
  query GetParty($partyIdentifier: String!) {
    party(partyIdentifier: $partyIdentifier) {
      __typename
      partyIdentifier
      partyTypeCode
      shortDescription
      longDescription
      createdDateTime
      updatedDateTime
      createdByUserGuid
      addresses {
        addressGuid
        addressName
        address
        city
        province
        postalCode
        country
        isPrimary
      }
      contactMethods {
        contactMethodGuid
        typeCode
        typeDescription
        value
        isPrimary
      }
      aliases {
        aliasGuid
        name
      }
      person {
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
        genderCode
        heightInCm
        weightInKg
        complexionCode
        buildCode
        hairColourCode
        hairLengthCode
        hairColourOther
        eyeColourCode
        eyeColourOther
        facialHairIndicator
        facialHairStyleCodes {
          personFacialStyleHairCodeGuid
          facialHairStyleCode
        }
        additionalHairDescriptors
        tattooIndicator
        tattooDescription
        additionalDescriptors
        comments
        boloIndicator
      }
      business {
        name
        businessGuid
        identifiers {
          businessIdentifierGuid
          identifierValue
          identifierCode
        }
        contactPeople {
          businessPersonXrefGuid
          business {
            businessGuid
          }
          person {
            personGuid
            firstName
            lastName
          }
          contactMethods {
            contactMethodGuid
            typeCode
            typeDescription
            value
            isPrimary
          }
        }
      }
    }
  }
`;

export type PartyParams = {
  id: string;
  tabKey?: string;
};

const PersonIdentifyingInfo: FC<{
  person: Person;
  genderOptions: ReadonlyArray<Option>;
  approximateAgeOptions: ReadonlyArray<Option>;
  countryOptions: ReadonlyArray<Option>;
  countrySubdivisionOptions: ReadonlyArray<Option>;
}> = ({ person, genderOptions, approximateAgeOptions, countryOptions, countrySubdivisionOptions }) => (
  <>
    {person.dateOfBirth !== null && (
      <p>
        <b>Date of birth: </b>
        {formatDateOfBirth(person.dateOfBirth)}
      </p>
    )}
    {person.approximateAgeCode && (
      <p>
        <b>Approximate age: </b>
        {approximateAgeOptions?.find((opt) => opt.value === person?.approximateAgeCode)?.label ??
          person.approximateAgeCode}
      </p>
    )}
    {person.driversLicenseNumber && (
      <p>
        <b>Driver's licence number: </b>
        {person.driversLicenseNumber}
      </p>
    )}
    {person.driversLicenseClass && (
      <p>
        <b>Driver's licence class: </b>
        {person.driversLicenseClass}
      </p>
    )}
    {person.driversLicenseCountryCode && (
      <p>
        <b>Driver's licence country: </b>
        {countryOptions?.find((opt) => opt.value === person?.driversLicenseCountryCode)?.label ??
          person.driversLicenseCountryCode}
      </p>
    )}
    {person.driversLicenseCountrySubdivisionCode && (
      <p>
        <b>Driver's licence province: </b>
        {countrySubdivisionOptions?.find((opt) => opt.value === person?.driversLicenseCountrySubdivisionCode)?.label ??
          person.driversLicenseCountrySubdivisionCode}
      </p>
    )}
    {person.genderCode && (
      <p>
        <b>Gender: </b>
        {genderOptions?.find((opt) => opt.value === person?.genderCode)?.label ?? person.genderCode}
      </p>
    )}
  </>
);

const ContactMethodsList: FC<{ contactMethods: ReadonlyArray<ContactMethod> }> = ({ contactMethods }) => (
  <>
    {contactMethods.map((contactMethod) => {
      return (
        <p key={contactMethod?.contactMethodGuid}>
          <b>{contactMethod?.typeDescription}: </b>
          {contactMethod?.typeCode === ContactMethods.PHONE
            ? formatPhoneNumber(contactMethod?.value ?? "")
            : contactMethod?.value}
          {contactMethod?.isPrimary && <Badge className="ms-1 badge">Primary</Badge>}
        </p>
      );
    })}
  </>
);

const AddressesList: FC<{
  addresses: ReadonlyArray<Address>;
  countryOptions: ReadonlyArray<Option>;
  countrySubdivisionOptions: ReadonlyArray<Option>;
}> = ({ addresses, countryOptions, countrySubdivisionOptions }) => (
  <>
    {addresses.map((address, index) => (
      <div
        key={address.addressGuid ?? `address-${index}`}
        className="party-details-item"
        style={index < addresses.length - 1 ? { marginBottom: "1em" } : undefined}
      >
        <h4 className="mb-3">
          {address.addressName || `Address ${index + 1}`}
          {address.isPrimary && <Badge className="ms-2 badge">Primary</Badge>}
        </h4>
        {address.address && (
          <p>
            <b>Address: </b>
            {address.address}
          </p>
        )}
        {address.city && (
          <p>
            <b>City: </b>
            {address.city}
          </p>
        )}
        {address.province && (
          <p>
            <b>Province: </b>
            {countrySubdivisionOptions?.find((opt) => opt.value === address?.province)?.label ?? address.province}
          </p>
        )}
        {address.postalCode && (
          <p>
            <b>Postal code: </b>
            {address.postalCode}
          </p>
        )}
        {address.country && (
          <p>
            <b>Country: </b>
            {countryOptions?.find((opt) => opt.value === address?.country)?.label ?? address.country}
          </p>
        )}
      </div>
    ))}
  </>
);

export const PartyView: FC = () => {
  const { id = "", tabKey } = useParams<PartyParams>();
  const navigate = useNavigate();
  const currentTab = tabKey || "details";
  const genderOptions = useAppSelector(selectGenderDropdown);
  const approximateAgeOptions = useAppSelector(selectApproximateAgeDropdown);
  const countryOptions = useAppSelector(selectCountries);
  const countrySubdivisionOptions = useAppSelector(selectCountrySubdivisions);
  const complexionOptions = useAppSelector(selectComplexionDropdown);
  const buildOptions = useAppSelector(selectBuildDropdown);
  const hairColourOptions = useAppSelector(selectHairColourDropdown);
  const hairLengthOptions = useAppSelector(selectHairLengthDropdown);
  const eyeColourOptions = useAppSelector(selectEyeColourDropdown);
  const facialHairStyleOptions = useAppSelector(selectFacialHairStyleDropdown);

  const { data, isLoading } = useGraphQLQuery<{ party: Party }>(GET_PARTY, {
    queryKey: ["party", id],
    variables: { partyIdentifier: id },
    enabled: !!id,
  });

  const partyData = data?.party;

  const addresses = (partyData?.addresses ?? []).filter((a): a is Address => a != null);

  let partyType;
  let partyId;
  if (partyData?.person) {
    partyType = PartyTypes.PERSON;
    partyId = partyData?.person?.personGuid;
  } else if (partyData?.business) {
    partyType = PartyTypes.BUSINESS;
    partyId = partyData?.business?.businessGuid;
  }

  const editButtonClick = () => {
    navigate(`/party/${id}/edit`);
  };

  const displayName = () => {
    let result = "";
    if (partyData?.person) {
      const parts = [partyData.person?.firstName, partyData.person?.middleNames, partyData.person?.lastName].filter(
        Boolean,
      );
      result = parts.join(" ");
    } else if (partyData?.business) {
      result = `${partyData.business?.name}`;
    }
    return result;
  };

  const personDob = partyData?.person?.dateOfBirth ? new Date(partyData.person.dateOfBirth) : null;
  const personIsYoung = partyData?.person ? isYoungPerson(personDob, partyData.person.approximateAgeCode) : false;

  const imperialHeight = cmToFeetInches(partyData?.person?.heightInCm ?? 0);
  const imperialWeight = kgToLb(partyData?.person?.weightInKg ?? 0);

  if (isLoading) {
    return (
      <div className="comp-complaint-details">
        <PartyHeader />
        <section className="comp-details-body comp-container">
          <div className="comp-details-content">
            <p>Loading party details...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      {!partyData && <div className="case-not-found">No data found for ID: {id}</div>}
      {partyData && (
        <div className="comp-complaint-details">
          <PartyHeader partyData={partyData} />
          <PartyTabs />
          {currentTab === "history" ? (
            <PartyHistoryTab partyIdentifier={id} />
          ) : (
            <section className="comp-details-body comp-container party-details-section">
              <hr className="comp-details-body-spacer"></hr>
              <h2>Party details</h2>
              <div className="party-details-summary-container">
                <div className="party-details-summary-vcard-container">{id ? <PartyCarousel partyId={id} /> : ""}</div>
                <div className="party-details-summary-info">
                  <div className="d-flex align-items-center gap-2">
                    <h3 className="mb-0">{displayName()}</h3>
                    {partyData?.person?.boloIndicator && <Badge className="comp-danger-badge">Caution / BOLO</Badge>}
                  </div>
                  {partyData?.business?.identifiers && (
                    <>
                      {partyData.business.identifiers.map((identifier) => {
                        return (
                          <p key={identifier?.businessIdentifierGuid}>
                            <b>
                              {BUSINESS_IDENTIFIER_LABELS[identifier?.identifierCode ?? ""] ??
                                identifier?.identifierCode}
                              :{" "}
                            </b>
                            {identifier?.identifierValue}
                          </p>
                        );
                      })}
                    </>
                  )}{" "}
                  {(personDob || personIsYoung) && (
                    <p className="d-flex align-items-center gap-2">
                      {personDob && (
                        <span>
                          <b>Age: </b>
                          {calculateAgeYears(personDob)}
                        </span>
                      )}
                      {personIsYoung && <Badge bg="species-badge comp-species-badge">Young person</Badge>}
                    </p>
                  )}
                </div>
                <div className="comp-details-section-header-actions party-details-summary-actions">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    id="details-screen-edit-button"
                    onClick={editButtonClick}
                  >
                    <i className="bi bi-pencil"></i>
                    <span>Edit party</span>
                  </Button>
                </div>
              </div>
              <br />
              <h4>Identifying information</h4>
              <div className="party-details-item">
                <p>
                  <b>Name: </b>
                  {displayName()}
                </p>
                {partyData?.aliases && (
                  <>
                    {partyData.aliases.map((alias) => {
                      return (
                        <p key={alias?.aliasGuid}>
                          <b>Alias: </b>
                          {alias?.name}
                        </p>
                      );
                    })}
                  </>
                )}
                {partyData?.person && (
                  <PersonIdentifyingInfo
                    person={partyData.person}
                    genderOptions={genderOptions}
                    approximateAgeOptions={approximateAgeOptions}
                    countryOptions={countryOptions}
                    countrySubdivisionOptions={countrySubdivisionOptions}
                  />
                )}
              </div>
              <br />

              <PartyComplianceHistory
                partyReference={id}
                partyTypeGuid={partyId ?? ""}
                partyType={partyType ?? ""}
              />

              <br />
              <h4>Contact information</h4>

              <div className="party-details-item">
                {partyData?.contactMethods && partyData.contactMethods.length > 0 && (
                  <ContactMethodsList contactMethods={partyData.contactMethods as ReadonlyArray<ContactMethod>} />
                )}
                {partyData?.business?.contactPeople && (
                  <>
                    <h4>Business contacts</h4>
                    {partyData.business.contactPeople.map((contactPerson, index) => {
                      return (
                        <div key={contactPerson?.person?.personGuid}>
                          <p>
                            <b>Name: </b>
                            {contactPerson?.person?.lastName}, {contactPerson?.person?.firstName}
                          </p>
                          {contactPerson?.contactMethods && (
                            <ContactMethodsList
                              contactMethods={contactPerson.contactMethods as ReadonlyArray<ContactMethod>}
                            />
                          )}
                          {index < (partyData.business?.contactPeople?.length ?? 0) - 1 && <hr />}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
              {addresses?.length > 0 && (
                <>
                  <br />
                  <h4>Addresses</h4>
                  <AddressesList
                    addresses={addresses}
                    countryOptions={countryOptions}
                    countrySubdivisionOptions={countrySubdivisionOptions}
                  />
                </>
              )}

              {partyData?.person && (
                <>
                  <br />
                  <h4>Physical descriptors</h4>
                  <div className="party-details-item">
                    {partyData?.person?.heightInCm && (
                      <p>
                        <b>Height: </b>
                        {partyData?.person?.heightInCm} cm ({imperialHeight.feet} feet {imperialHeight.inches} inches)
                      </p>
                    )}
                    {partyData?.person?.weightInKg && (
                      <p>
                        <b>Weight: </b>
                        {partyData?.person?.weightInKg} kg ({imperialWeight} lbs)
                      </p>
                    )}
                    {partyData?.person?.complexionCode && (
                      <p>
                        <b>Complexion: </b>
                        {complexionOptions?.find((opt) => opt.value === partyData?.person?.complexionCode)?.label ??
                          partyData?.person.complexionCode}
                      </p>
                    )}
                    {partyData?.person?.buildCode && (
                      <p>
                        <b>Build: </b>
                        {buildOptions?.find((opt) => opt.value === partyData?.person?.buildCode)?.label ??
                          partyData?.person.buildCode}
                      </p>
                    )}
                    {partyData?.person?.eyeColourCode && (
                      <p>
                        <b>Eye colour: </b>
                        {eyeColourOptions?.find((opt) => opt.value === partyData?.person?.eyeColourCode)?.label ??
                          partyData?.person.eyeColourCode}
                        {partyData?.person?.eyeColourOther && ` (${partyData?.person?.eyeColourOther})`}
                      </p>
                    )}
                    {partyData?.person?.hairColourCode && (
                      <p>
                        <b>Hair colour: </b>
                        {hairColourOptions?.find((opt) => opt.value === partyData?.person?.hairColourCode)?.label ??
                          partyData?.person.hairColourCode}
                        {partyData?.person?.hairColourOther && ` (${partyData?.person?.hairColourOther})`}
                      </p>
                    )}
                    {partyData?.person?.hairLengthCode && (
                      <p>
                        <b>Hair length: </b>
                        {hairLengthOptions?.find((opt) => opt.value === partyData?.person?.hairLengthCode)?.label ??
                          partyData?.person.hairLengthCode}
                      </p>
                    )}
                    {partyData?.person?.facialHairIndicator != null && (
                      <p>
                        <b>Has facial hair: </b>
                        {partyData.person.facialHairIndicator ? "Yes" : "No"}
                      </p>
                    )}
                    {partyData?.person?.facialHairStyleCodes && (
                      <>
                        {partyData.person.facialHairStyleCodes.map((fhs) => {
                          return (
                            <p key={fhs?.personFacialStyleHairCodeGuid}>
                              <b>Facial hair style: </b>
                              {facialHairStyleOptions?.find((opt) => opt.value === fhs?.facialHairStyleCode)?.label ??
                                fhs?.facialHairStyleCode}
                            </p>
                          );
                        })}
                      </>
                    )}
                    {partyData?.person?.additionalHairDescriptors && (
                      <p>
                        <b>Additional hair descriptors: </b>
                        {partyData?.person?.additionalHairDescriptors}
                      </p>
                    )}
                    {partyData?.person?.tattooIndicator != null && (
                      <p>
                        <b>Has tattoos: </b>
                        {partyData.person.tattooIndicator ? "Yes" : "No"}
                      </p>
                    )}
                    {partyData?.person?.tattooDescription && (
                      <p>
                        <b>Tattoo description: </b>
                        {partyData?.person?.tattooDescription}
                      </p>
                    )}
                    {partyData?.person?.additionalDescriptors && (
                      <p>
                        <b>Additional descriptors: </b>
                        {partyData?.person?.additionalDescriptors}
                      </p>
                    )}
                  </div>
                </>
              )}
              <br />
              <h4>C&E history</h4>
              <div className="party-details-item">
                <p>
                  <i>&#8226; Agencies that dealt with Party, Officer, Contravention Enf Action, Site etc..</i>
                </p>
              </div>
              <br />
              {partyData?.person?.comments && (
                <>
                  <h4>Additional information</h4>
                  <div className="party-details-item">
                    <p>
                      {partyData?.person?.comments && (
                        <p>
                          <b>Comments: </b>
                          {partyData?.person?.comments}
                        </p>
                      )}
                    </p>
                  </div>
                  <br />
                </>
              )}
            </section>
          )}
        </div>
      )}
    </>
  );
};
