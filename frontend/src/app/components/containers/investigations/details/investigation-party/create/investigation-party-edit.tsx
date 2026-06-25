import { FC, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { ToggleInformation } from "@/app/common/toast";

interface InvestigationPartyEditProps {
  investigationGuid: string;
}

const InvestigationPartyEdit: FC<InvestigationPartyEditProps> = ({ investigationGuid }) => {
  const navigate = useNavigate();
  const { partyIdentifier } = useParams<{ partyIdentifier: string }>();

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
    <>
      <div className="row align-items-center mb-3">
        <div className="col">
          <h2 className="mb-0">{title}</h2>
        </div>
        <div className="col-auto d-flex gap-2">
          <Button
            id="party-cancel-button"
            variant="outline-primary"
            onClick={cancelButtonClick}
          >
            Cancel
          </Button>
          <Button
            id="party-save-button"
            variant="primary"
            onClick={saveButtonClick}
          >
            Save changes
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="p-4 text-muted">{isEditMode ? "Edit party form" : "New party form"}</div>
        </div>
      </div>
    </>
  );
};

export default InvestigationPartyEdit;
