import { FC, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { CompSelect } from "../../../../common/comp-select";
import DatePicker from "react-datepicker";
import { useAppSelector } from "../../../../../hooks/hooks";
import { selectComplaintAssignedBy } from "../../../../../store/reducers/complaints";
import { selectOfficersByAgencyDropdown } from "../../../../../store/reducers/officer";
import Option from "../../../../../types/app/option";
import { DrugAuthorization as DrugAuthorizationType } from "../../../../../types/app/complaints/outcomes/wildlife/drug-authorization";

type Props = {
  agency: string;
  drugAuthtorization?: DrugAuthorizationType;
  update: Function;
};

export const DrugAuthorization: FC<Props> = ({ agency, drugAuthtorization, update }) => {
  const officers = useAppSelector(selectOfficersByAgencyDropdown(agency));
  const assigned = useAppSelector(selectComplaintAssignedBy);

  const [assignedOfficer] = useState(assigned)

  const [authorizedBy, setAuthorizedBy] = useState(drugAuthtorization?.officer);
  const [authorizedOn, setAuthorizedOn] = useState(drugAuthtorization?.date);

  useEffect(() => {
    if ((assigned && !authorizedBy)) {
      setAuthorizedBy(assigned);
    } else if(assigned !== assignedOfficer && authorizedBy){
      setAuthorizedBy(assigned || "");
    }
  }, [assigned, authorizedBy, assignedOfficer]);

  const getValue = (property: string): Option | undefined => {
    if (property === "officer") {
      return officers.find((item) => item.value === authorizedBy);
    }
  };


  const handleAuthorizedByChange = (input: string | undefined) => {
    setAuthorizedBy(input);
    const newDrugAuth: DrugAuthorizationType = {officer: input ?? "", date: authorizedOn ?? undefined};
    update(newDrugAuth);

  };

  const handleAuthorizedOnChange = (input: Date | undefined | null) => {
    setAuthorizedOn(input ?? undefined);
    
    update({officer: authorizedBy, date: input ?? undefined});
  };

  return (
    <div className="comp-animal-outcome-report-inner-spacing">
      <Row>
        <Col md={5}>
          <div className="comp-details-label-input-pair" id="officer-assigned-pair-id">
            <label
              id="officer-assigned-authorization-select-label-id"
              htmlFor="officer-assigned-authorization-select-id"
            >
              Officer
            </label>
            <CompSelect
              id="officer-assigned-authorization-select-id"
              classNamePrefix="comp-select"
              onChange={(evt) => {
                handleAuthorizedByChange(evt?.value);
              }}
              className="comp-details-input"
              options={officers}
              placeholder="Select"
              enableValidation={false}
              value={getValue("officer")}
            />
          </div>
        </Col>

        <Col md="4">
          <div className="comp-details-label-input-pair" id="officer-assigned-pair-id">
            <label id="drug-authorization-incident-time-label-id" htmlFor="drug-authorization-incident-time">
              Date
            </label>
            <DatePicker
              id="drug-authorization-incident-time"
              showIcon
              dateFormat="yyyy-MM-dd"
              wrapperClassName="comp-details-edit-calendar-input"
              maxDate={new Date()}
              onChange={(evt) => {
                handleAuthorizedOnChange(evt);
              }}
              selected={authorizedOn}
            />
          </div>
        </Col>
        <Col></Col>
        <Col></Col>
      </Row>
    </div>
  );
};
