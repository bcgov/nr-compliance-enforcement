import { FC, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { CompSelect } from "../../../../common/comp-select";
import DatePicker from "react-datepicker";
import { useAppSelector } from "../../../../../hooks/hooks";
import { selectOfficersByAgencyDropdown } from "../../../../../store/reducers/officer";
import Option from "../../../../../types/app/option";

type Props = {
  assigned: string | null;
  officer?: string;
  date?: Date;
  agency: string;
  update: Function;
};

export const DrugAuthorization: FC<Props> = ({ agency, assigned, officer, date, update }) => {
  const officers = useAppSelector(selectOfficersByAgencyDropdown(agency));

  useEffect(() => { 
    if(!officer && assigned){ 
      updateModel("officer", assigned)
    }
  }, [officer, assigned])

  const getValue = (property: string): Option | undefined => {
    if (property === "officer") {
      return officers.find((item) => item.value === (!officer ? assigned : officer));
    }
  };

  const updateModel = (property: string, value: string | Date | null | undefined) => {
    const source = { officer, date };
    const authorization = { ...source, [property]: value };

    update("drugAuthorization", authorization);
  };

  console.log("officer: ", officer);
  console.log("assigned: ", assigned);

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
                console.log(evt?.value);
                updateModel("officer", evt?.value);
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
                updateModel("date", evt);
              }}
              selected={date}
            />
          </div>
        </Col>
        <Col></Col>
        <Col></Col>
      </Row>
    </div>
  );
};
