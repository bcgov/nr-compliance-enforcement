import { FC } from "react";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectComplaintCallerInformation } from "../../../../store/reducers/complaints";
import { formatPhoneNumber } from "react-phone-number-input/input";

export const CallerInformation: FC = () => {
  const { name, primaryPhone, secondaryPhone, alternatePhone, address, email, reportedByCode } = useAppSelector(
    selectComplaintCallerInformation,
  );

  return (
    <section className="comp-details-section">
      <h3>Caller Information</h3>
      <dl>
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
          <dd id="comp-details-phone-3">{formatPhoneNumber(alternatePhone !== undefined ? alternatePhone : "")}</dd>
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
          <dt>Reporting Organization</dt>
          <dd id="comp-details-reported">{reportedByCode?.longDescription}</dd>
        </div>
      </dl>
    </section>
  );
};
