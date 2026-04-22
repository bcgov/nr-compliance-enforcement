import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Dropdown } from "react-bootstrap";
import { Investigation, UpdateInvestigationInput } from "@/generated/graphql";
import { InvestigationTabs } from "@/app/components/containers/investigations/details/investigation-navigation";
import { applyStatusClass } from "@/app/common/methods";
import { useAppDispatch } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { CHANGE_STATUS } from "@/app/types/modal/modal-types";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { InvestigationStatusModal } from "@/app/components/containers/investigations/details/investigation-status-modal";

const UPDATE_INVESTIGATION = gql`
  mutation UpdateInvestigation($investigationGuid: String!, $input: UpdateInvestigationInput!) {
    updateInvestigation(investigationGuid: $investigationGuid, input: $input) {
      investigationGuid
      investigationStatus {
        investigationStatusCode
        shortDescription
        longDescription
      }
    }
  }
`;

interface InvestigationHeaderProps {
  investigation?: Investigation;
  onStatusUpdated?: () => void;
}

export const InvestigationHeader: FC<InvestigationHeaderProps> = ({ investigation, onStatusUpdated }) => {
  const dispatch = useAppDispatch();
  const investigationId = investigation?.name || investigation?.investigationGuid || "Unknown";

  const [showStatusModal, setShowStatusModal] = useState(false);

  const updateStatusMutation = useGraphQLMutation(UPDATE_INVESTIGATION, {
    onSuccess: () => {
      ToggleSuccess("Investigation status updated successfully");
      setShowStatusModal(false);
      onStatusUpdated?.();
    },
    onError: () => {
      ToggleError("Failed to update investigation status");
    },
  });

  const handleOpenStatusModal = () => setShowStatusModal(true);
  const handleCloseStatusModal = () => setShowStatusModal(false);
  const handleSaveStatus = async (investigationGuid: string, input: UpdateInvestigationInput) => {
    await updateStatusMutation.mutateAsync({ investigationGuid, input });
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
                  <Link to="/investigations">Investigations</Link>
                </li>
                <li
                  className="breadcrumb-item"
                  aria-current="page"
                >
                  {investigationId}
                </li>
              </ol>
            </nav>
          </div>
          {/* <!-- breadcrumb end --> */}

          {/* <!-- investigation info start --> */}
          <div className="comp-details-title-container">
            <div className="comp-details-title-info">
              <h1 className="comp-box-complaint-id">
                <span>Investigation #</span>
                {investigationId}
              </h1>
              {investigation?.investigationStatus?.investigationStatusCode && (
                <span
                  className={`badge ${applyStatusClass(investigation?.investigationStatus.investigationStatusCode)}`}
                >
                  {investigation?.investigationStatus.shortDescription}
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
      <InvestigationTabs />
      <InvestigationStatusModal
        show={showStatusModal}
        onHide={handleCloseStatusModal}
        onSave={handleSaveStatus}
        investigation={investigation}
        isSaving={updateStatusMutation.isPending}
      />
    </>
  );
};
