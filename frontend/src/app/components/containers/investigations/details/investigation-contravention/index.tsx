import { ContraventionForm } from "@/app/components/containers/investigations/details/investigation-contravention/contravention-form";
import { ContraventionItem } from "@/app/components/containers/investigations/details/investigation-contravention/contravention-item";
import { Contravention, Investigation, InvestigationParty } from "@/generated/graphql";
import { FC, useState } from "react";
import { Button } from "react-bootstrap";

interface InvestigationContraventionProps {
  investigationGuid: string;
  investigationData?: Investigation;
}

export const InvestigationContraventions: FC<InvestigationContraventionProps> = ({
  investigationGuid,
  investigationData,
}) => {
  // State
  const [showAddCard, setshowAddCard] = useState(false);
  const [editingContraventionId, setEditingContraventionId] = useState<string | null>(null);

  const contraventions = investigationData?.contraventions;

  // Functions
  const handleCloseForm = () => {
    setshowAddCard(false);
    setEditingContraventionId(null);
  };

  const handleEditContravention = (contraventionId: string) => {
    setEditingContraventionId(contraventionId);
  };

  return (
    <div className="comp-details-view">
      <div className="row">
        <div className="col-12">
          <h3>Contraventions</h3>
        </div>
      </div>

      <div className="contraventions-list">
        {contraventions?.map((contravention, index) => (
          <div key={contravention?.contraventionIdentifier}>
            {editingContraventionId === contravention?.contraventionIdentifier ? (
              <ContraventionForm
                activityGuid={investigationGuid}
                onClose={handleCloseForm}
                contravention={contravention}
                parties={investigationData?.parties as InvestigationParty[]}
                contraventionNumber={(index + 1).toString()}
              />
            ) : (
              <ContraventionItem
                contravention={contravention as Contravention}
                investigationGuid={investigationGuid}
                index={index}
                canEdit={!editingContraventionId}
                onEdit={handleEditContravention}
              />
            )}
          </div>
        ))}
      </div>

      {showAddCard && (
        <ContraventionForm
          activityGuid={investigationGuid}
          onClose={handleCloseForm}
          parties={investigationData?.parties as InvestigationParty[]}
        />
      )}

      <div className="row">
        <div className="col-12">
          <Button
            variant="primary"
            size="sm"
            id="details-screen-edit-button"
            onClick={() => setshowAddCard(true)}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add contravention</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
