import { Complaint } from "@apptypes/app/complaints/complaint";
import { AppUser } from "@apptypes/app/app_user/app_user";

const getOfficerAssigned = (complaint: Complaint, officers?: AppUser[] | null): string => {
  const delegate = complaint.delegates.find((item) => item.type === "ASSIGNEE");
  if (delegate && officers) {
    const officer = officers.find((o) => o.app_user_guid === delegate.appUserGuid);
    if (officer) {
      return `${officer.last_name}, ${officer.first_name}`;
    }
    return String(delegate.appUserGuid);
  }

  return "";
};

export default getOfficerAssigned;
