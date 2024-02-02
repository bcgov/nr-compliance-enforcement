import { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { CompSelect } from "../../../../common/comp-select";
import DatePicker from "react-datepicker";
import { useAppSelector } from "../../../../../hooks/hooks";
import { selectOfficersByAgencyDropdown } from "../../../../../store/reducers/officer";

type Props = {
  officer: string;
  date?: Date;
  agency: string;

  update: Function;
};

export const DrugAuthorization: FC<Props> = ({ agency, officer, date, update }) => {
  const officers = useAppSelector(selectOfficersByAgencyDropdown(agency));

  const updateModel = (property: string, value: string | Date | null | undefined) => {
    if (value) {
      const source = { officer, date };
      const authorization = { ...source, [property]: value };

      update("drugAuthorization", authorization);
    }
  };

  return (
    <div className="comp-outcome-report-inner-spacing">
      <Row>
        <Col md={5}>
          <div className="comp-details-label-input-pair" id="officer-assigned-pair-id">
            <label id="officer-assigned-select-label-id">Officer Assigned</label>
            <CompSelect
              id="officer-assigned-select-id"
              classNamePrefix="comp-select"
              onChange={(evt) => {
                updateModel("officer", evt?.value);
              }}
              className="comp-details-input"
              options={officers}
              placeholder="Select"
              enableValidation={false}
            />
          </div>
        </Col>

        <Col md="4">
          <div className="comp-details-label-input-pair" id="officer-assigned-pair-id">
            <label id="officer-assigned-select-label-id">Date</label>
            <DatePicker
              id="complaint-incident-time"
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
