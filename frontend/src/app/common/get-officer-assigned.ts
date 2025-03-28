import { Complaint } from "@apptypes/app/complaints/complaint";

const getOfficerAssigned = (complaint: Complaint): string => {
  const officer = complaint.delegates.find((item) => item.type === "ASSIGNEE");
  if (officer) {
    const {
      person: { firstName, lastName },
    } = officer;
    return `${lastName}, ${firstName}`;
  }

  return "";
};

export default getOfficerAssigned;
