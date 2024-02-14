import { FC, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { CompSelect } from "../../../../common/comp-select";
import DatePicker from "react-datepicker";
import { useAppSelector } from "../../../../../hooks/hooks";
import { selectComplaintAssignedBy } from "../../../../../store/reducers/complaints";
import { selectOfficersByAgencyDropdown } from "../../../../../store/reducers/officer";
import Option from "../../../../../types/app/option";

type Props = {
  officer?: string;
  date?: Date;
  agency: string;
  update: Function;
};

export const DrugAuthorization: FC<Props> = ({ agency, officer, date, update }) => {
  const officers = useAppSelector(selectOfficersByAgencyDropdown(agency));
  const assigned = useAppSelector(selectComplaintAssignedBy);

  const [authorizedBy, setAuthorizedBy] = useState(officer);
  const [authorizedOn, setAuthorizedOn] = useState(date);

  useEffect(() => {
    if (assigned && !authorizedBy) {
      setAuthorizedBy(assigned);
    }
  }, [assigned, authorizedBy]);

  const getValue = (property: string): Option | undefined => {
    if (property === "officer") {
      return officers.find((item) => item.value === authorizedBy);
    }
  };

  const updateModel = (property: string, value: string | Date | null | undefined) => {
    const source = { officer: authorizedBy, date: authorizedOn };
    const authorization = { ...source, [property]: value };

    update("drugAuthorization", authorization);
  };

  const handleAuthorizedByChange = (input: string | undefined) => {
    setAuthorizedBy(input);
    updateModel("officer", input);
  };

  const handleAuthorizedOnChange = (input: Date | undefined | null) => {
    if (input) {
      setAuthorizedOn(input);
      updateModel("date", input);
    }
  };

  return (
    <div className="comp-outcome-report-inner-spacing">
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
