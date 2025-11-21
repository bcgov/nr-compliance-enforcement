import { FC, useState } from "react";
import { gql } from "graphql-request";
import { useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { Button, Accordion } from "react-bootstrap";
import { ContinuationReport, ContinuationReportInput, Investigation } from "@/generated/graphql";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { ReportRenderer } from "./report-renderer";
import { MenuBarEditor } from "./menu-bar-editor";
import { startOfDay } from "date-fns";
import { formatDate, formatDateTime, formatTime } from "@common/methods";
import DatePicker from "react-datepicker";
import Option from "@apptypes/app/option";
import { CompSelect } from "@/app/components/common/comp-select";
import { useSelector } from "react-redux";
import { AppUser } from "@apptypes/app/app_user/app_user";
import { RootState } from "@/app/store/store";
import { selectOfficersByAgency } from "@/app/store/reducers/officer";
import { useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid, profileDisplayName } from "@store/reducers/app";
import "@assets/sass/investigation-continuation.scss";

const SAVE_REPORT_MUTATION = gql`
  mutation SaveContinuationReport($input: ContinuationReportInput!) {
    saveContinuationReport(input: $input) {
      continuationReportGuid
      investigationGuid
      contentJson
      actionedTimestamp
      reportedTimestamp
      actionedAppUserGuidRef
      reportedAppUserGuidRef
    }
  }
`;

const GET_REPORTS = gql`
  query GetContinuationReports($investigationGuid: String!) {
    getContinuationReports(investigationGuid: $investigationGuid) {
      continuationReportGuid
      investigationGuid
      contentJson
      actionedTimestamp
      reportedTimestamp
      actionedAppUserGuidRef
      reportedAppUserGuidRef
    }
  }
`;

const SEARCH = gql`
  query Search($q: String!) {
    search(q: $q) {
      continuationReportGuid
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
  const reportedUserName = useAppSelector(profileDisplayName);
  const defaultOfficer: Option = { value: reportedUserGuid, label: reportedUserName };

  //States
  const [activeKey, setActiveKey] = useState<string>("0");
  const [selectedActionedDateTime, setSelectedActionedDateTime] = useState<Date>();
  const [selectedOfficer, setSelectedOfficer] = useState<Option | null>(defaultOfficer);
  const [plainText, setPlainText] = useState<string>("");

  // Tiptap editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "New entry...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    onUpdate: ({ editor }) => {
      setPlainText(editor.getText());
    },
  });

  // GraphQL queries and mutations
  const { data, refetch } = useGraphQLQuery(GET_REPORTS, {
    queryKey: ["reports", investigationGuid],
    variables: { investigationGuid: investigationGuid },
    enabled: !!investigationGuid,
  });

  const saveReportMutation = useGraphQLMutation(SAVE_REPORT_MUTATION, {
    onSuccess: (data: any) => {
      ToggleSuccess("Report saved successfully");
      reset();
    },
    onError: (error: any) => {
      console.error("Error saving report:", error);
      ToggleError("Failed to save report");
    },
  });

  const assignableOfficers: Option[] =
    officersInAgencyList && officersInAgencyList.length > 0
      ? officersInAgencyList.map((officer: AppUser) => ({
          value: officer.app_user_guid,
          label: `${officer.last_name}, ${officer.first_name}`,
        }))
      : [];

  const handleAssignedOfficerChange = (selected: Option | null) => {
    setSelectedOfficer(selected);
  };

  const reset = () => {
    editor?.commands.clearContent();
    setSelectedActionedDateTime(undefined);
    setSelectedOfficer(defaultOfficer);
  };

  const handleSave = async () => {
    if (!editor) return;
    const json = JSON.stringify(editor.getJSON());
    const input: ContinuationReportInput = {
      investigationGuid: investigationGuid,
      continuationReportGuid: null,
      contentJson: json,
      contentText: plainText,
      actionedTimestamp: selectedActionedDateTime || new Date(),
      reportedTimestamp: new Date(),
      actionedAppUserGuidRef: selectedOfficer ? selectedOfficer.value : "",
      reportedAppUserGuidRef: reportedUserGuid || "",
    };
    await saveReportMutation.mutateAsync({ input });
    refetch();
  };

  const reports = data?.getContinuationReports ?? [];

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

  const handleActionedDateTimeChange = (date: Date) => {
    setSelectedActionedDateTime(date);
  };

  return (
    <div className="comp-complaint-details mt-4">
      <div
        className="comp-details-section-header flex gap-3"
        style={{ justifyContent: "flex-start" }}
      >
        <h2>Continuation report</h2>
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
        <div className="lg:col-span-2 space-y-4 border rounded p-3 mb-5">
          <MenuBarEditor editor={editor} />
          <div className="">
            <EditorContent
              editor={editor}
              className="tiptap-editor"
            />
          </div>

          {/* Date actioned */}
          <div className="mt-3 comp-details-form-row w-50">
            <div className="col-4">
              Date/time actioned<span className="required-ind">*</span>
            </div>
            <div className="comp-details-edit-input">
              <DatePicker
                id="complaint-actioned-time"
                showIcon
                timeInputLabel="Time:"
                onChange={handleActionedDateTimeChange}
                selected={selectedActionedDateTime}
                showTimeInput
                dateFormat="yyyy-MM-dd HH:mm"
                timeFormat="HH:mm"
                wrapperClassName="comp-details-edit-calendar-input"
                maxDate={new Date()}
                monthsShown={2}
                showPreviousMonths
              />
            </div>
          </div>

          {/* Officer assigned */}
          <div
            className="comp-details-form-row w-50"
            id="officer-assigned-pair-id"
          >
            <div
              className="col-4"
              id="officer-assigned-select-label-id"
            >
              Officer<span className="required-ind">*</span>
            </div>
            <CompSelect
              id="officer-assigned-select-id"
              showInactive={false}
              classNamePrefix="comp-select"
              onChange={(e) => handleAssignedOfficerChange(e)}
              className="comp-details-input w-100"
              options={assignableOfficers}
              placeholder="Select"
              enableValidation={false}
              value={selectedOfficer ?? null}
              isClearable={true}
            />
          </div>

          <div className="comp-details-form-buttons">
            <Button
              variant="outline-primary"
              id="outcome-cancel-button"
              title="Cancel Outcome"
              onClick={reset}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              id="outcome-save-button"
              title="Save Outcome"
              onClick={handleSave}
              disabled={!plainText || !selectedActionedDateTime || !selectedOfficer}
            >
              Save
            </Button>
          </div>
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
                              {group.reports.map((report: ContinuationReport, idx: number) => {
                                const actionedOfficer =
                                  officersInAgencyList.find(
                                    (officer) => officer.app_user_guid === report.actionedAppUserGuidRef,
                                  ) ?? null;
                                const reportedOfficer = officersInAgencyList.find(
                                  (officer) => officer.app_user_guid === report.reportedAppUserGuidRef,
                                );

                                return (
                                  <div
                                    key={report.continuationReportGuid}
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
                                        key={report.continuationReportGuid}
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
