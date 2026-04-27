import { FC } from "react";
import { Badge, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCaseActivities } from "@/app/hooks/use-case-activities";
import { SectorComplaint } from "@/app/types/app/complaints/sector-complaint";
import { Inspection, Investigation } from "@/generated/graphql";
import { applyStatusClass } from "@/app/common/methods";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable, selectCommunityCodeDropdown } from "@/app/store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { complaintTypeToName } from "@/app/types/app/complaint-types";
import Option from "@apptypes/app/option";

interface CaseActivitiesProps {
  caseGuid: string;
  caseName?: string;
}

export const CaseActivities: FC<CaseActivitiesProps> = ({ caseGuid, caseName }) => {
  const { linkedComplaints, investigations, inspections, isLoading } = useCaseActivities(caseGuid);

  const agencies = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));
  const complaintStatusCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_STATUS));
  const natureOfComplaints = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.NATURE_OF_COMPLAINT));
  const girTypeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GIR_TYPE));
  const violationCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.VIOLATIONS));
  const communityOptions = useAppSelector(selectCommunityCodeDropdown);

  const getAgencyDescription = (agencyCode: string): string => {
    const agency = agencies?.find((item: any) => item.agency === agencyCode);
    return agency?.longDescription || agencyCode;
  };

  const getComplaintStatusDescription = (statusCode: string): string => {
    const code = complaintStatusCodes?.find((item: any) => item.complaintStatus === statusCode);
    return code?.longDescription || statusCode;
  };

  const getComplaintTypeDescription = (typeCode: string): string => {
    return complaintTypeToName(typeCode) || typeCode;
  };

  const getIssueTypeDescription = (typeCode: string, issueCode: string): string => {
    if (!issueCode) return "—";

    switch (typeCode) {
      case "HWCR":
        const natureCode = natureOfComplaints?.find((item: any) => item.natureOfComplaint === issueCode);
        return natureCode?.longDescription || issueCode;
      case "GIR":
        const girCode = girTypeCodes?.find((item: any) => item.girType === issueCode);
        return girCode?.longDescription || issueCode;
      case "ERS":
        const violCode = violationCodes?.find((item: any) => item.violation === issueCode);
        return violCode?.longDescription || issueCode;
      default:
        return issueCode;
    }
  };

  const renderComplaintItem = (complaint: SectorComplaint) => {
    const complaintId = complaint?.id || "Unknown";
    const agencyDescription = getAgencyDescription(complaint?.ownedBy || "");
    const typeDescription = getComplaintTypeDescription(complaint?.type || "");
    const issueTypeDescription = getIssueTypeDescription(complaint?.type || "", complaint?.issueType || "");
    const statusDescription = getComplaintStatusDescription(complaint?.status || "");

    return (
      <li
        key={complaintId}
        className="mb-2"
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div>
            <Link
              to={`/complaint/${complaint.type}/${complaintId}`}
              className="comp-cell-link"
            >
              {complaintId}
            </Link>
            <span className="ms-2">• {agencyDescription}</span>
            <span className="ms-2">• {typeDescription}</span>
            <span className="ms-2">• {issueTypeDescription}</span>
            <Badge className={`badge ${applyStatusClass(statusDescription || "")} ms-2`}>
              {statusDescription || "Unknown"}
            </Badge>
          </div>
        </div>
      </li>
    );
  };

  const renderInvestigationItem = (investigation: Investigation) => {
    const investigationId = investigation?.name || investigation?.investigationGuid || "Unknown";
    const agencyDescription = getAgencyDescription(investigation?.leadAgency || "");
    const partiesCount = investigation?.parties?.length ?? 0;
    const status =
      investigation?.investigationStatus?.shortDescription ||
      investigation?.investigationStatus?.investigationStatusCode ||
      "Unknown";
    const communityLabel = investigation.community
      ? (communityOptions.find((o: Option) => o.value === investigation.community)?.label ?? investigation.community)
      : "";

    return (
      <li
        key={investigationId}
        className="mb-2"
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div>
            <Link
              to={`/investigation/${investigation?.investigationGuid}`}
              className="comp-cell-link"
            >
              {investigationId}
            </Link>
            <span className="ms-2">• {agencyDescription}</span>
            <span className="ms-2">• {partiesCount} parties</span>
            <span className="ms-2">• {communityLabel || "Unknown"}</span>
            <Badge className={`badge ${applyStatusClass(status || "")} ms-2`}>{status || "Unknown"}</Badge>
          </div>
        </div>
      </li>
    );
  };

  const renderInspectionItem = (inspection: Inspection) => {
    const inspectionId = inspection?.name || inspection?.inspectionGuid || "Unknown";
    const agencyDescription = getAgencyDescription(inspection?.leadAgency || "");
    const partiesCount = inspection?.parties?.length ?? 0;
    const status =
      inspection?.inspectionStatus?.shortDescription || inspection?.inspectionStatus?.inspectionStatusCode || "Unknown";

    return (
      <li
        key={inspectionId}
        className="mb-2"
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div>
            <Link
              to={`/inspection/${inspection?.inspectionGuid}`}
              className="comp-cell-link"
            >
              {inspectionId}
            </Link>
            <span className="ms-2">• {agencyDescription}</span>
            <span className="ms-2">• {partiesCount} parties</span>
            <Badge className={`badge ${applyStatusClass(status || "")} ms-2`}>{status || "Unknown"}</Badge>
          </div>
        </div>
      </li>
    );
  };

  return (
    <>
      <h2 className="mb-6 mb-sm-3">Associated data</h2>
      <div className="border rounded p-4 mb-4 bg-white">
        <div className="d-flex flex-column mb-3">
          <span className="mb-2 mb-sm-0 larger-font">
            <b>Case</b>&nbsp;
            <Link
              to={`/case/${caseGuid}`}
              className="comp-cell-link fw-semibold"
            >
              #{caseName ?? caseGuid}
            </Link>
          </span>
        </div>

        {isLoading ? (
          <div className="d-flex align-items-center gap-2 text-muted">
            <Spinner
              animation="border"
              size="sm"
            />
            <span>Loading associated data...</span>
          </div>
        ) : (
          <>
            {linkedComplaints && linkedComplaints.length > 0 && (
              <div className="mb-3 ms-3">
                <div className="mb-2 text-black-50">
                  <i className="bi bi-arrow-return-right text-black"></i>&nbsp;Complaint(s):
                </div>
                <ul className="mb-0 ms-4 list-unstyled">
                  {linkedComplaints.map((complaint) => renderComplaintItem(complaint))}
                </ul>
              </div>
            )}

            {investigations && investigations.length > 0 && (
              <div className="mb-3 ms-3">
                <div className="mb-2 text-black-50">
                  <i className="bi bi-arrow-return-right text-black"></i>&nbsp;Investigation(s):
                </div>
                <ul className="mb-0 ms-4 list-unstyled">
                  {investigations.map((investigation) => renderInvestigationItem(investigation))}
                </ul>
              </div>
            )}

            {inspections && inspections.length > 0 && (
              <div className="mb-3 ms-3">
                <div className="mb-2 text-black-50">
                  <i className="bi bi-arrow-return-right text-black"></i>&nbsp;Inspection(s):
                </div>
                <ul className="mb-0 ms-4 list-unstyled">
                  {inspections.map((inspection) => renderInspectionItem(inspection))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CaseActivities;
