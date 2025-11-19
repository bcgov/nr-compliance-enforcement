import { useAppDispatch } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { ADD_CONTRAVENTION } from "@/app/types/modal/modal-types";
import { FC, useState } from "react";
import { Button } from "react-bootstrap";

interface InvestigationContraventionProps {
  investigationGuid: string;
}

export const InvestigationContraventions: FC<InvestigationContraventionProps> = ({ investigationGuid }) => {
  const dispatch = useAppDispatch();
  const [contraventions, setContraventions] = useState<any[]>([]);

  const handleAddContravention = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: ADD_CONTRAVENTION,
        data: {
          title: "Add contravention to investigation",
          description: "",
          activityGuid: investigationGuid,
          activityType: "investigation",
        },
        callback: () => {
          // Add the new contravention to the list
          const contravention = localStorage.getItem("contraventions");
          setContraventions((prev) => [...prev, contravention]);
        },
      }),
    );
  };

  return (
    <div className="comp-details-view">
      <div className="comp-details-content">
        <div className="d-flex align-items-center gap-4 mb-3">
          <h3 className="mb-0">Contraventions</h3>
          <Button
            variant="outline-primary"
            size="sm"
            id="details-screen-edit-button"
            onClick={handleAddContravention}
          >
            <i className="bi bi-plus-lg text-primary"></i>
            <span>Add Contravention</span>
          </Button>
        </div>
        <div className="contraventions-list">
          {contraventions.map((contravention, index) => (
            <div key={index}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <dt>Contravention {index + 1} (Alleged)</dt>
                <Button
                  variant="outline-primary"
                  size="sm"
                  id="details-screen-edit-button"
                >
                  <i className="bi bi-pencil text-primary"></i>
                  <span>Edit</span>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  id="details-screen-edit-button"
                >
                  <i className="bi bi-trash text-danger"></i>
                  <span>Delete</span>
                </Button>
              </div>
              <div className="contravention-item p-3 mb-2">{contravention}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
