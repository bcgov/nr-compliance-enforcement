import { FC } from "react";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectComplaintCallerInformation } from "../../../../store/reducers/complaints";
import { formatPhoneNumber } from "react-phone-number-input/input";
import { Card } from "react-bootstrap";
import { FEATURE_TYPES } from "../../../../constants/feature-flag-types";
import { isFeatureActive } from "../../../../store/reducers/app";

export const CallerInformation: FC = () => {
  const { name, primaryPhone, secondaryPhone, alternatePhone, address, email, reportedByCode, isPrivacyRequested } =
    useAppSelector(selectComplaintCallerInformation);
  const enablePrivacyFeature = useAppSelector(isFeatureActive(FEATURE_TYPES.PRIV_REQ));

  let privacy = "";
  if (isPrivacyRequested === "Y") {
    privacy = "Yes";
  } else if (isPrivacyRequested === "N") {
    privacy = "No";
  }

  return (
    <section className="comp-details-section">
      <h3>Caller Information</h3>
      <Card>
        <Card.Body>
          <dl>
            {enablePrivacyFeature && (
              <div>
                <dt>Privacy requested</dt>
                <dd id="comp-details-name">{privacy}</dd>
              </div>
            )}
            <div>
              <dt>Name</dt>
              <dd id="comp-details-name">{name}</dd>
            </div>
            <div>
              <dt>Primary Phone</dt>
              <dd id="comp-details-phone">{formatPhoneNumber(primaryPhone !== undefined ? primaryPhone : "")}</dd>
            </div>
            <div>
              <dt>Alternative Phone 1</dt>
              <dd id="comp-details-phone-1">{formatPhoneNumber(secondaryPhone !== undefined ? secondaryPhone : "")}</dd>
            </div>
            <div>
              <dt>Alternative Phone 2</dt>
              <dd id="comp-details-phone-2">{formatPhoneNumber(alternatePhone !== undefined ? alternatePhone : "")}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd id="comp-details-address">{address}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd id="comp-details-email">{email}</dd>
            </div>
            <div>
              <dt>Organization Reporting the Complaint</dt>
              <dd id="comp-details-reported">{reportedByCode?.longDescription}</dd>
            </div>
          </dl>
        </Card.Body>
      </Card>
    </section>
  );
};
