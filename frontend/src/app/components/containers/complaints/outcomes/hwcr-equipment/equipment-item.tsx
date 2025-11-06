import { FC, useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { BsExclamationCircleFill } from "react-icons/bs";
import { formatDate } from "@common/methods";

import { DeleteConfirmModal } from "@components/modal/instances/delete-confirm-modal";
import { EquipmentDetailsDto } from "@/app/types/app/complaint-outcomes/equipment-details";
import { selectOfficerByAuthUserGuid } from "@store/reducers/officer";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";

import Option from "@apptypes/app/option";

import { selectAllEquipmentDropdown, selectHasQuantityEquipment } from "@store/reducers/code-table";
import { CASE_ACTION_CODE } from "@constants/case_actions";
import { deleteEquipment } from "@/app/store/reducers/complaint-outcome-thunks";
import { CompLocationInfo } from "@components/common/comp-location-info";
import { selectComplaintViewMode } from "@/app/store/reducers/complaints";
import { useParams } from "react-router-dom";

interface EquipmentItemProps {
  equipment: EquipmentDetailsDto;
  isEditDisabled: boolean;
  onEdit: (guid: string) => void;
}
export const EquipmentItem: FC<EquipmentItemProps> = ({ equipment, isEditDisabled, onEdit }) => {
  const dispatch = useAppDispatch();
  const hasQuantityEquipment = useAppSelector(selectHasQuantityEquipment);
  const { id = "" } = useParams<{ id: string }>();
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

  const handleDeleteEquipment = (equipmentId: string | undefined) => {
    if (equipmentId) {
      dispatch(deleteEquipment(id, equipmentId));
    }
  };

  const equipmentTypeCodes = useAppSelector(selectAllEquipmentDropdown); //Want to be able to display inactive equipment

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
  const setEquipmentOfficer = useAppSelector(selectOfficerByAuthUserGuid(`${setEquipmentActor}`));
  const removedEquipmentOfficer = useAppSelector(selectOfficerByAuthUserGuid(`${removedEquipmentActor}`));

  const setEquipmentFullName = setEquipmentOfficer
    ? `${setEquipmentOfficer.last_name}, ${setEquipmentOfficer.first_name}`
    : null;
  const removedEquipmentFullName = removedEquipmentOfficer
    ? `${removedEquipmentOfficer.last_name}, ${removedEquipmentOfficer.first_name}`
    : null;

  const isInEdit = useAppSelector((state) => state.complaintOutcomes.isInEdit);
  const isReadOnly = useAppSelector(selectComplaintViewMode);

  const showSectionErrors =
    !removedEquipmentDate &&
    getValue("equipment")?.value !== "SIGNG" &&
    getValue("equipment")?.value !== "TRCAM" &&
    getValue("equipment")?.value !== "LLTHL" &&
    getValue("equipment")?.value !== "K9UNT" &&
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
        className={`comp-equipment-card ${!removedEquipmentFullName && equipment.typeCode !== "K9UNT" && equipment.typeCode !== "LLTHL" ? "active" : "inactive"}`}
        border={showSectionErrors ? "danger" : "default"}
      >
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
              {!removedEquipmentFullName && equipment.typeCode !== "K9UNT" && equipment.typeCode !== "LLTHL" && (
                <Badge bg="success">Active</Badge>
              )}
            </div>
            <div className="comp-outcome-item-header-actions">
              <Button
                variant="outline-primary"
                size="sm"
                title="Edit equipment details"
                id="equipment-edit-button"
                onClick={() => handleEdit(equipment)}
                disabled={isReadOnly}
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
                disabled={isReadOnly}
              >
                <i className="bi bi-trash3"></i>
                <span>Delete</span>
              </Button>
            </div>
          </div>

          {/* EQUIPMENT META */}
          <dl>
            {hasQuantityEquipment.includes(equipment.typeCode) && (
              <div>
                <dt>Quantity</dt>
                <dd>{equipment.quantity}</dd>
              </div>
            )}
            <div>
              <dt>Location/address</dt>
              <dd>{equipment.address}</dd>
            </div>
            <CompLocationInfo
              xCoordinate={equipment.xCoordinate}
              yCoordinate={equipment.yCoordinate}
            />
            <br />
            <div>
              <dt>Set/used by</dt>
              <dd>
                <span id="equipment-officer-set-div">{setEquipmentFullName}</span>
              </dd>
            </div>
            <div>
              <dt>Set/used date</dt>
              <dd id="equipment-date-set-div">{formatDate(setEquipmentDate?.toString())}</dd>
            </div>
            {equipment.id &&
              removedEquipmentActor &&
              equipment.typeCode !== "K9UNT" &&
              equipment.typeCode !== "LLTHL" && (
                <>
                  <div>
                    <dt>Removed by</dt>
                    <dd>
                      <span id="comp-details-assigned-officer-name-text-id">{removedEquipmentFullName}</span>
                    </dd>
                  </div>
                  <div>
                    <dt>Removal date</dt>
                    <dd id="equipment-removal-date">{formatDate(removedEquipmentDate?.toString())}</dd>
                  </div>
                </>
              )}
            {equipment.id && ["Y", "N"].includes(equipment?.wasAnimalCaptured) && (
              <div>
                <dt>Was animal captured?</dt>
                <dd id="comp-details-animal-captured-text-id">{equipment?.wasAnimalCaptured === "Y" ? "Yes" : "No"}</dd>
              </div>
            )}
          </dl>
        </Card.Body>
      </Card>
    </>
  );
};
