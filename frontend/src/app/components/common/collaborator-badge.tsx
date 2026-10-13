import { Collaborator } from "@/app/types/app/complaints/collaborator";
import { Badge } from "react-bootstrap";

export function renderLabelElement(collaborator: Collaborator): JSX.Element {
  return (
    <>
      <span>
        {collaborator.lastName}, {collaborator.firstName}{" "}
      </span>
      <Badge
        className="comp-badge-gray"
        key={collaborator.collaboratorAgency}
      >
        {collaborator.collaboratorAgency}
      </Badge>
    </>
  );
}
