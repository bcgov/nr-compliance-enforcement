import { FC, useState } from "react";
import { gql } from "graphql-request";
import { useParams } from "react-router-dom";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { Button, Accordion } from "react-bootstrap";
import { ActivityNote, ActivityNoteInput, Investigation } from "@/generated/graphql";
import { startOfDay } from "date-fns";
import { formatDate, formatDateTime, formatTime } from "@common/methods";
import "@assets/sass/investigation-continuation.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { selectOfficersByAgency } from "@/app/store/reducers/officer";
import { useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid } from "@/app/store/reducers/app";
import { ReportRenderer } from "@/app/components/containers/investigations/details/investigation-continuation/report-renderer";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { ActivityNoteWrapper } from "@/app/components/containers/layout/activity-note";

const GET_REPORTS = gql`
  query GetActivityNotes($investigationGuid: String!, $activityNoteCode: String) {
    getActivityNotes(investigationGuid: $investigationGuid, activityNoteCode: $activityNoteCode) {
      activityNoteGuid
      activityNoteCode
      investigationGuid
      contentJson
      actionedTimestamp
      reportedTimestamp
      actionedAppUserGuidRef
      reportedAppUserGuidRef
    }
  }
`;

// TODO move all these
export const GET_ACTIVITY_NOTES_BY_TASK = gql`
  query GetActivityNotesByTask($taskGuid: String!) {
    getActivityNotesByTask(taskGuid: $taskGuid) {
      activityNoteGuid
      activityNoteCode
      investigationGuid
      contentJson
      actionedTimestamp
      reportedTimestamp
      actionedAppUserGuidRef
      reportedAppUserGuidRef
    }
  }
`;

export const SAVE_ACTIVITY_NOTE_MUTATION = gql`
  mutation SaveActivityNote($input: ActivityNoteInput!) {
    saveActivityNote(input: $input) {
      activityNoteGuid
      activityNoteCode
      investigationGuid
      contentJson
      actionedTimestamp
      reportedTimestamp
      actionedAppUserGuidRef
      reportedAppUserGuidRef
    }
  }
`;

interface InvestigationContinuationProps {
  investigationData?: Investigation;
}

export const InvestigationContinuation: FC<InvestigationContinuationProps> = ({ investigationData }) => {
  const { investigationGuid = "" } = useParams<{ investigationGuid: string }>();
  const leadAgency = investigationData?.leadAgency ?? "COS";
  const officersInAgencyList = useSelector((state: RootState) => selectOfficersByAgency(state, leadAgency));
  const reportedUserGuid = useAppSelector(appUserGuid);

  // States
  const [activeKey, setActiveKey] = useState<string>("0");
  const [isValid, setIsValid] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);
  const [showContinuationReportErrors, setShowContinuationReportErrors] = useState(false);
  const [continuationReport, setContinuationReport] = useState<Partial<ActivityNoteInput>>();

  // GraphQL queries and mutations
  const { data, refetch } = useGraphQLQuery(GET_REPORTS, {
    queryKey: ["reports", investigationGuid],
    variables: { investigationGuid: investigationGuid, activityNoteCode: "CONTREP" },
    enabled: !!investigationGuid,
  });

  const saveReportMutation = useGraphQLMutation(SAVE_ACTIVITY_NOTE_MUTATION, {
    onSuccess: () => {
      ToggleSuccess("Report saved successfully");
      refetch();
    },
    onError: (error: any) => {
      console.error("Error saving report:", error);
      ToggleError("Failed to save report");
    },
  });

  // Validation handler
  const handleContinuationReportValidationChange = (isValid: boolean) => {
    setIsValid(isValid);
  };

  // Values handler
  const handleContinuationReportValuesChange = (values: Partial<ActivityNoteInput>) => {
    setContinuationReport(values);
  };

  // Cancel handler
  const resetForm = async () => {
    setShouldReset(true);
    setTimeout(() => setShouldReset(false), 100); // reset Trigger
  };

  // Save handler
  const handleActivityNoteSave = async () => {
    if (!isValid) {
      setShowContinuationReportErrors(true);
      return; // Validation failed - errors are now showing in the form
    }

    const values = continuationReport;

    if (values) {
      const input: ActivityNoteInput = {
        investigationGuid,
        activityNoteGuid: null,
        activityNoteCode: "CONTREP",
        contentJson: values.contentJson,
        contentText: values.contentText,
        actionedTimestamp: values.actionedTimestamp || new Date(),
        reportedTimestamp: new Date(),
        actionedAppUserGuidRef: values.actionedAppUserGuidRef,
        reportedAppUserGuidRef: reportedUserGuid,
      };

      await saveReportMutation.mutateAsync({ input });
      resetForm();
    }
  };

  const reports = data?.getActivityNotes ?? [];

  let groups: any;
  if (reports) {
    const grouped = reports?.reduce((acc: any, report: any) => {
      const dateKey = startOfDay(report.actionedTimestamp).toISOString();
      if (!acc[dateKey]) acc[dateKey] = { date: report.actionedTimestamp, reports: [] };
      acc[dateKey].reports.push(report);
      return acc;
    }, {});

    groups = Object.values(grouped).sort((a: any, b: any) => b.date - a.date);
  }

  return (
    <div className="comp-complaint-details">
      <div
        className="comp-details-section-header flex gap-3"
        style={{ justifyContent: "flex-start" }}
      >
        <h3>Continuation report</h3>
        <Button
          variant="outline-primary"
          size="sm"
          id="details-screen-edit-button"
          onClick={() => {}}
          disabled={true}
        >
          <i className="bi bi-download"></i>
          <span>Download report</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityNoteWrapper
          index={0} // Only ever one
          onValidationChange={handleContinuationReportValidationChange}
          onValuesChange={handleContinuationReportValuesChange}
          showErrors={showContinuationReportErrors}
          shouldReset={shouldReset}
        />

        <div className="comp-details-form-buttons">
          <Button
            variant="outline-primary"
            id="outcome-cancel-button"
            title="Cancel Outcome"
            onClick={resetForm}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            id="outcome-save-button"
            title="Save Outcome"
            onClick={handleActivityNoteSave}
          >
            {saveReportMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2 max-h-screen overflow-y-auto">
            {reports?.length === 0 ? (
              <p className="text-gray-500">There are no reports yet.</p>
            ) : (
              <div className="mt-4">
                <Accordion
                  defaultActiveKey={groups.map((_: any, index: number) => index.toString())}
                  onSelect={(k) => setActiveKey(k as string)}
                  alwaysOpen
                >
                  {groups &&
                    groups.length > 0 &&
                    groups.map((group: any, index: number) => {
                      const eventKey = index.toString();
                      const isOpen = activeKey.includes(eventKey);

                      return (
                        <Accordion.Item
                          eventKey={eventKey}
                          key={group.date}
                        >
                          {/* Date Header */}
                          <Accordion.Header className="d-flex justify-content-between align-items-center">
                            <div>
                              <i
                                className="bi bi-calendar comp-margin-right-xxs"
                                id="complaint-incident-date"
                                style={{ marginRight: "8px" }}
                              ></i>
                              {formatDate(group.date.toString())}
                            </div>
                            <div>
                              {isOpen ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                            </div>
                          </Accordion.Header>

                          {/* Reports in this group */}
                          <Accordion.Body className="p-0 overflow-hidden">
                            <div className="row">
                              {group.reports.map((report: ActivityNote, idx: number) => {
                                const actionedOfficer =
                                  officersInAgencyList.find(
                                    (officer) => officer.app_user_guid === report.actionedAppUserGuidRef,
                                  ) ?? null;
                                const reportedOfficer = officersInAgencyList.find(
                                  (officer) => officer.app_user_guid === report.reportedAppUserGuidRef,
                                );

                                return (
                                  <div
                                    key={report.activityNoteGuid}
                                    className={`mt-3 pl-0 ${idx === group.reports.length - 1 ? "mb-4" : "mb-2"}`}
                                  >
                                    <div className="comp-profile-card-info">
                                      <div
                                        className="comp-avatar comp-avatar-sm comp-avatar-orange"
                                        data-initials-modal={
                                          actionedOfficer
                                            ? `${actionedOfficer?.last_name?.substring(0, 1)}${actionedOfficer?.first_name?.substring(0, 1)}`
                                            : "U"
                                        }
                                      ></div>
                                      <div>
                                        <strong>
                                          {actionedOfficer
                                            ? `${actionedOfficer?.last_name}, ${actionedOfficer?.first_name}`
                                            : "Unknown"}
                                        </strong>
                                      </div>
                                      <div>
                                        <i className="bi bi-clock comp-margin-left-xxs comp-margin-right-xxs"></i>
                                        {formatTime(report.actionedTimestamp.toString())}
                                      </div>
                                    </div>
                                    <div className="prose prose-sm max-w-none">
                                      <ReportRenderer
                                        key={report.activityNoteGuid}
                                        json={report.contentJson ? JSON.parse(report.contentJson) : {}}
                                      />
                                    </div>
                                    <div style={{ fontSize: "14px", color: "#7a7a7a" }}>
                                      {`• Recorded on ${formatDateTime(report.reportedTimestamp)} by ${reportedOfficer?.last_name}, ${reportedOfficer?.first_name} (${reportedOfficer?.agency_code_ref})`}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      );
                    })}
                </Accordion>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
