import { ComplaintActionItems } from "@/app/components/containers/complaints/lists/complaint-action-items";
import { usePark } from "@/app/hooks/usePark";
import { getUserAgency } from "@/app/service/user-service";
import { FC } from "react";

type ComplaintActionsCellProps = {
  id: string;
  complaintType: string;
  ownedBy: string;
  zone: string;
  status: string;
  parkGuid?: string;
};

export const ComplaintActionsCell: FC<ComplaintActionsCellProps> = ({
  id,
  complaintType,
  ownedBy,
  zone,
  status,
  parkGuid,
}) => {
  const userAgency = getUserAgency();
  const derivedStatus = ownedBy === userAgency ? status : "Referred";
  const park = usePark(parkGuid);
  const parkAreaGuids = park?.parkAreas?.map((area) => area.parkAreaGuid) ?? [];

  return (
    <ComplaintActionItems
      complaint_identifier={id}
      complaint_type={complaintType}
      zone={zone}
      agency_code={ownedBy}
      complaint_status={derivedStatus}
      park_area_guids={parkAreaGuids}
    />
  );
};
