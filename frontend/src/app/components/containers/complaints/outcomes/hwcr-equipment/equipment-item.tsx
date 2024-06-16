import { FC, useState } from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import { BsExclamationCircleFill } from "react-icons/bs";
import { formatDate, getAvatarInitials } from "../../../../../common/methods";

import { DeleteConfirmModal } from "../../../../modal/instances/delete-confirm-modal";
import { EquipmentDetailsDto } from "../../../../../types/app/case-files/equipment-details";
import { selectOfficerByPersonGuid } from "../../../../../store/reducers/officer";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";

import Option from "../../../../../types/app/option";

import { selectEquipmentDropdown } from "../../../../../store/reducers/code-table";
import { CASE_ACTION_CODE } from "../../../../../constants/case_actions";
import { deleteEquipment } from "../../../../../store/reducers/case-thunks";

interface EquipmentItemProps {
  equipment: EquipmentDetailsDto;
  isEditDisabled: boolean;
  onEdit: (guid: string) => void;
}
export const EquipmentItem: FC<EquipmentItemProps> = ({ equipment, isEditDisabled, onEdit }) => {
  const dispatch = useAppDispatch();

  const [showModal, setShowModal] = useState(false);

  const handleEdit = (equipment: EquipmentDetailsDto) => {
    if (equipment.id) {
      onEdit(equipment.id);
    }
  };

  // for turning codes into values
  const getValue = (property: string): Option | undefined => {
    return equipmentTypeCodes.find((item) => item.value === equipment.typeCode);
  };

  const handleDeleteEquipment = (id: string | undefined) => {
    if (id) {
      dispatch(deleteEquipment(id));
    }
  };

  const equipmentTypeCodes = useAppSelector(selectEquipmentDropdown);

  const setEquipmentActor = equipment.actions?.findLast(
    (action) => action.actionCode === CASE_ACTION_CODE.SETEQUIPMT,
  )?.actor;
  const removedEquipmentActor = equipment.actions?.findLast(
    (action) => action.actionCode === CASE_ACTION_CODE.REMEQUIPMT,
  )?.actor;
  const setEquipmentDateString = equipment.actions?.findLast(
    (action) => action.actionCode === CASE_ACTION_CODE.SETEQUIPMT,
  )?.date;
  const setEquipmentDate = setEquipmentDateString ? new Date(new Date(setEquipmentDateString)) : null;
  const removedEquipmentDateString = equipment.actions?.findLast(
    (action) => action.actionCode === CASE_ACTION_CODE.REMEQUIPMT,
  )?.date;
  const removedEquipmentDate = removedEquipmentDateString ? new Date(new Date(removedEquipmentDateString)) : null;

  const setEquipmentOfficer = useAppSelector(selectOfficerByPersonGuid(`${setEquipmentActor}`));
  const removedEquipmentOfficer = useAppSelector(selectOfficerByPersonGuid(`${removedEquipmentActor}`));

  const setEquipmentFullName = setEquipmentOfficer
    ? `${setEquipmentOfficer.person_guid.first_name} ${setEquipmentOfficer.person_guid.last_name}`
    : null;
  const removedEquipmentFullName = removedEquipmentOfficer
    ? `${removedEquipmentOfficer.person_guid.first_name} ${removedEquipmentOfficer.person_guid.last_name}`
    : null;

  const isInEdit = useAppSelector((state) => state.cases.isInEdit);
  const showSectionErrors =
    !removedEquipmentDate &&
    getValue("equipment")?.value !== "SIGNG" &&
    getValue("equipment")?.value !== "TRCAM" &&
    isInEdit.showSectionErrors;

  return (
    <>
      <DeleteConfirmModal
        show={showModal}
        title="Delete equipment?"
        content="All the data in this section will be lost."
        onHide={() => setShowModal(false)}
        onDelete={() => {
          handleDeleteEquipment(equipment.id);
          setShowModal(false);
        }}
        confirmText="Yes, delete equipment"
      />
      <Card
        className={`comp-equipment-card ${!removedEquipmentFullName ? "active" : "inactive"}`}
        border={showSectionErrors ? "danger" : "default"}
      >
        {/* {!removedEquipmentFullName && <div className="badge">Active</div>} */}
        <Card.Body>
          {showSectionErrors && (
            <div className="section-error-message">
              <BsExclamationCircleFill />
              <span>Provide date equipment was removed before closing the complaint.</span>
            </div>
          )}

          {/* EQUIPMENT ITEM HEADER */}
          <div className="comp-equipment-item-header">
            <div className="comp-equipment-item-header-title">
              <h4 id="equipment-type-title">{getValue("equipment")?.label}</h4>
              {!removedEquipmentFullName && <Badge bg="success">Active</Badge>}
            </div>
            <div className="comp-equipment-item-header-actions">
              <Button
                variant="outline-primary"
                size="sm"
                title="Edit equipment details"
                id="equipment-edit-button"
                onClick={() => handleEdit(equipment)}
              >
                <i className="bi bi-pencil"></i>
                <span>Edit</span>
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                title="Delete equipment"
                id="equipment-delete-button"
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-trash3"></i>
                <span>Delete</span>
              </Button>
            </div>
          </div>

          {/* EQUIPMENT META */}
          <dl>
            <div>
              <dt>Address</dt>
              <dd>{equipment.address}</dd>
            </div>
            <div>
              <dt>Latitude/Longitude</dt>
              <dd>
                {equipment.yCoordinate} {equipment.xCoordinate}
              </dd>
            </div>
            <div>
              <dt>Set by</dt>
              <dd>
                <div
                  className="comp-avatar comp-avatar-sm comp-avatar-orange"
                  data-initials-sm={getAvatarInitials(`${setEquipmentFullName}`)}
                >
                  <span id="equipment-officer-set-div">{setEquipmentFullName}</span>
                </div>
              </dd>
            </div>
            <div>
              <dt>Date set</dt>
              <dd id="equipment-date-set-div">{formatDate(setEquipmentDate?.toString())}</dd>
            </div>
            {equipment.id && removedEquipmentActor && (
              <>
                <div>
                  <dt>Removed by</dt>
                  <dd>
                    <div
                      className="comp-avatar comp-avatar-sm comp-avatar-orange"
                      data-initials-sm={getAvatarInitials(removedEquipmentFullName ?? "")}
                    >
                      <span id="comp-details-assigned-officer-name-text-id">{removedEquipmentFullName}</span>
                    </div>
                  </dd>
                </div>
                <div>
                  <dt>Removal date</dt>
                  <dd id="equipment-removal-date">{formatDate(removedEquipmentDate?.toString())}</dd>
                </div>
                <div>
                  <dt>Was animal captured?</dt>
                  <dd id="comp-details-animal-captured-text-id">
                    {equipment?.wasAnimalCaptured === "Y" ? "Yes" : "No"}
                  </dd>
                </div>
              </>
            )}
          </dl>

          <div hidden>
            <div className="equipment-item-content">
              <div className="label">Address</div>
              <div className="value">{equipment.address}</div>
            </div>
            <Row>
              <Col
                xs={12}
                md={4}
              >
                <div className="equipment-item-content">
                  <div className="label">Latitude</div>
                  <div className="value">{equipment.yCoordinate}</div>
                </div>
              </Col>
              <Col
                xs={12}
                md={4}
              >
                <div className="equipment-item-content">
                  <div className="label">Longitude</div>
                  <div
                    className="value"
                    id=""
                  >
                    {equipment.xCoordinate}
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col
                xs={12}
                md={4}
              >
                <div className="equipment-item-content">
                  <div className="label">Set by</div>
                  <div className="comp-details-content">
                    <div
                      data-initials-sm={getAvatarInitials(`${setEquipmentFullName}`)}
                      className="comp-pink-avatar-sm"
                    >
                      <span
                        id="equipment-officer-set-div"
                        className="comp-padding-left-xs"
                      >
                        {setEquipmentFullName}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
              <Col
                xs={12}
                md={4}
              >
                <div
                  className="equipment-item-content"
                  id="equipment-date-set-div"
                >
                  <div className="label">Set date</div>
                  <div className="value">{formatDate(setEquipmentDate?.toString())}</div>
                </div>
              </Col>
            </Row>
            {equipment.id && removedEquipmentActor && (
              <Row>
                <Col
                  xs={12}
                  md={4}
                >
                  <div className="equipment-item-content">
                    <div className="label">Removed by</div>
                    <div className="comp-details-content">
                      <div
                        data-initials-sm={getAvatarInitials(removedEquipmentFullName ?? "")}
                        className="comp-pink-avatar-sm"
                      >
                        <span
                          id="comp-details-assigned-officer-name-text-id"
                          className="comp-padding-left-xs"
                        >
                          {removedEquipmentFullName}
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col
                  xs={12}
                  md={4}
                >
                  <div className="equipment-item-content">
                    <div className="label">Removed date</div>
                    <div
                      className="value"
                      id=""
                    >
                      {formatDate(removedEquipmentDate?.toString())}
                    </div>
                  </div>
                </Col>
              </Row>
            )}
            {equipment.id && ["Y", "N"].includes(equipment?.wasAnimalCaptured) ? (
              <Row>
                <Col
                  xs={12}
                  md={4}
                >
                  <div className="equipment-item-content">
                    <div className="label">Was an animal Captured?</div>
                    <div className="comp-details-content">
                      <div>
                        <span
                          id="comp-details-animal-captured-text-id"
                          className="comp-padding-left-xs"
                        >
                          {equipment?.wasAnimalCaptured === "Y" ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            ) : (
              ""
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
