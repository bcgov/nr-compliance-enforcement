import { InvestigationHeader } from "@/app/components/containers/investigations/details/investigation-header";
import { FC } from "react";
import { useParams } from "react-router-dom";

export type InvestigationParams = {
  id: string;
};

export const InvestigationDetails: FC = () => {
  const { id = "" } = useParams<InvestigationParams>();

  return (
    <div className="comp-complaint-details">
      <InvestigationHeader investigationId={id} />
      Investigation!
    </div>
  );
};
