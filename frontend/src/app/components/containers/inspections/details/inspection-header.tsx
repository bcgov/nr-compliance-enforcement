import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Dropdown } from "react-bootstrap";
import { Inspection, UpdateInspectionInput } from "@/generated/graphql";
import { gql } from "graphql-request";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ChangeStatusModal } from "@/app/components/common/change-status-modal";
import { applyStatusClass } from "@/app/common/methods";

const UPDATE_INSPECTION = gql`
  mutation UpdateInspection($inspectionGuid: String!, $input: UpdateInspectionInput!) {
    updateInspection(inspectionGuid: $inspectionGuid, input: $input) {
      inspectionGuid
      inspectionStatus {
        inspectionStatusCode
        shortDescription
        longDescription
      }
    }
  }
`;

interface InspectionHeaderProps {
  inspection?: Inspection;
  onStatusUpdated?: () => void;
}

export const InspectionHeader: FC<InspectionHeaderProps> = ({ inspection, onStatusUpdated }) => {
  const inspectionId = inspection?.name || inspection?.inspectionGuid || "Unknown";

  const [showStatusModal, setShowStatusModal] = useState(false);

  const updateStatusMutation = useGraphQLMutation(UPDATE_INSPECTION, {
    onSuccess: () => {
      ToggleSuccess("Inspection status updated successfully");
      setShowStatusModal(false);
      onStatusUpdated?.();
    },
    onError: () => {
      ToggleError("Failed to update inspection status");
    },
  });

  const handleOpenStatusModal = () => setShowStatusModal(true);
  const handleCloseStatusModal = () => setShowStatusModal(false);
  const handleSaveStatus = async (input: UpdateInspectionInput, inspectionGuid?: string | null) => {
    await updateStatusMutation.mutateAsync({ inspectionGuid, input });
  };

  return (
    <>
      <div className="comp-details-header">
        <div className="comp-container">
          {/* <!-- breadcrumb start --> */}
          <div className="comp-complaint-breadcrumb">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item comp-nav-item-name-inverted">
                  <Link to="/inspections">Inspections</Link>
                </li>
                <li
                  className="breadcrumb-item"
                  aria-current="page"
                >
                  {inspectionId}
                </li>
              </ol>
            </nav>
          </div>
          {/* <!-- breadcrumb end --> */}

          {/* <!-- inspection info start --> */}
          <div className="comp-details-title-container">
            <div className="comp-details-title-info">
              <h1 className="comp-box-complaint-id">
                <span>Inspection #</span>
                {inspectionId}
              </h1>
              {inspection?.inspectionStatus?.inspectionStatusCode && (
                <span className={`badge ${applyStatusClass(inspection?.inspectionStatus.inspectionStatusCode)}`}>
                  {inspection?.inspectionStatus.shortDescription}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="comp-header-actions">
              <div className="comp-header-actions-mobile">
                <Dropdown>
                  <Dropdown.Toggle
                    aria-label="Actions Menu"
                    variant="outline-primary"
                    className="icon-btn"
                    id="dropdown-basic"
                  >
                    <i className="bi bi-three-dots-vertical"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item
                      as="button"
                      id="update-status-button"
                      onClick={handleOpenStatusModal}
                    >
                      <i className="bi bi-arrow-repeat"></i>
                      <span>Update Status</span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      disabled={true}
                    >
                      <i className="bi bi-gear"></i>
                      <span>Placeholder Action</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="comp-header-actions-desktop">
                <Button
                  id="details-screen-update-status-button"
                  title="Update status"
                  variant="outline-light"
                  onClick={handleOpenStatusModal}
                >
                  <i className="bi bi-arrow-repeat"></i>
                  <span>Update status</span>
                </Button>
                <Dropdown className="comp-header-kebab-menu">
                  <Dropdown.Toggle
                    aria-label="Actions Menu"
                    variant="outline-light"
                    className="kebab-btn"
                    id="dropdown-basic"
                  >
                    <i className="bi bi-three-dots-vertical"></i>
                    <span>More actions</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item
                      as="button"
                      disabled={true}
                    >
                      <i className="bi bi-gear"></i>
                      <span>Placeholder Action</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangeStatusModal
        show={showStatusModal}
        onHide={handleCloseStatusModal}
        onSave={handleSaveStatus}
        data={inspection}
        type="inspection"
        isSaving={updateStatusMutation.isPending}
      />
    </>
  );
};
