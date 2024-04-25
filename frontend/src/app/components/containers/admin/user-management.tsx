import { FC, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { assignOfficerToOffice, selectOfficersDropdown } from "../../../store/reducers/officer";
import { CompSelect } from "../../common/comp-select";
import Option from "../../../types/app/option";
import { fetchOfficeAssignments, selectOfficesForAssignmentDropdown } from "../../../store/reducers/office";
import { ToastContainer } from "react-toastify";
import { ToggleSuccess } from "../../../common/toast";
import { clearNotification, selectNotification } from "../../../store/reducers/app";

export const UserManagement: FC = () => {
  const dispatch = useAppDispatch();
  const officers = useAppSelector(selectOfficersDropdown);
  const officeAssignments = useAppSelector(selectOfficesForAssignmentDropdown);
  const notification = useAppSelector(selectNotification);

  const [officer, setOfficer] = useState<Option>();
  const [officerError, setOfficerError] = useState<string>("");
  const [office, setOffice] = useState<Option>();
  const [officeError, setOfficeError] = useState<string>("");

  useEffect(() => {
    if (officeAssignments) dispatch(fetchOfficeAssignments());
  }, [dispatch]);

  useEffect(() => {
    const { type } = notification;
    if (type !== "") {
      dispatch(clearNotification());
    }
  }, [dispatch, notification]);

  const handleOfficerChange = (input: any) => {
    if (input.value) {
      setOfficer(input);
    }
  };

  const handleOfficeChange = (input: any) => {
    if (input.value) {
      setOffice(input);
    }
  };

  const resetValidationErrors = () => {
    setOfficeError("");
    setOfficerError("");
  };

  const validateUserAssignment = (): boolean => {
    resetValidationErrors();

    if (!officer) {
      setOfficerError("User is required");
    }

    if (!office) {
      setOfficeError("Office is required");
    }

    return office && officer ? true : false;
  };

  const handleSubmit = () => {
    if (validateUserAssignment()) {
      const officerId = officer?.value ? officer.value : "";
      const officeId = office?.value ? office.value : "";

      dispatch(assignOfficerToOffice(officerId, officeId));
      ToggleSuccess("success");
    }
  };

  const handleCancel = () => {
    resetValidationErrors();
  };
  return (
    <>
      <ToastContainer />

      <Container>
        <Row>
          <Col>
            <h1>User Administration</h1>
            <p>Manage user agency / office location. Select a user and Agency + Location </p>
          </Col>
        </Row>
        <Row>
          <Col>
            {" "}
            {"Select User"}
            <CompSelect
              id="species-select-id"
              classNamePrefix="comp-select"
              onChange={(evt) => handleOfficerChange(evt)}
              classNames={{
                menu: () => "top-layer-select",
              }}
              options={officers}
              placeholder="Select"
              enableValidation={true}
              value={officer}
              errorMessage={officerError}
            />
          </Col>
          <Col>
            {" "}
            Select Office
            <CompSelect
              id="species-select-id"
              classNamePrefix="comp-select"
              onChange={(evt) => handleOfficeChange(evt)}
              classNames={{
                menu: () => "top-layer-select",
              }}
              options={officeAssignments}
              placeholder="Select"
              enableValidation={true}
              value={office}
              errorMessage={officeError}
            />
          </Col>
          <Col>
            {" "}
            <br />
            <Button
              variant="outline-primary"
              onClick={handleCancel}
            >
              cancel
            </Button>{" "}
            &nbsp;
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Col>

          <Col></Col>
        </Row>
      </Container>
    </>
  );
};
