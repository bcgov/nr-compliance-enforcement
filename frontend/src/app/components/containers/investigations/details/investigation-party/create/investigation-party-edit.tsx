import { FC, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToggleInformation } from "@/app/common/toast";
import { InvestigationPartyEditHeader } from "./investigation-party-edit-header";

const InvestigationPartyEdit: FC = () => {
  const navigate = useNavigate();
  const { investigationGuid = "", partyIdentifier } = useParams<{
    investigationGuid: string;
    partyIdentifier: string;
  }>();

  const isEditMode = !!partyIdentifier;

  // TODO: title becomes the saved name / role-based placeholder once the form lands.
  const title = isEditMode ? "Edit party" : "New Party";

  const cancelButtonClick = useCallback(() => {
    navigate(`/investigation/${investigationGuid}/parties`);
  }, [navigate, investigationGuid]);

  const saveButtonClick = useCallback(() => {
    ToggleInformation("Save");
  }, []);

  return (
    <div className="comp-investigation-edit-headerdetails">
      <InvestigationPartyEditHeader
        isEditMode={isEditMode}
        title={title}
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
        investigationGuid={investigationGuid}
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h2>Party details</h2>
        </div>
        <div className="p-4 text-muted">{isEditMode ? "Edit party form" : "New party form"}</div>
      </section>
    </div>
  );
};

export default InvestigationPartyEdit;
