import http from "k6/http";
import { check } from "k6";
import { COS_USER_CREDS } from "../../common/auth.js";

const VALID_HWCR_COMPLAINT_ID = "23-031120";

// Search for open HWCR complaints in the South Peace region
export const getComplaintDetails = async (host, requestConfig) => {
  check(
    await http.get(host + `/api/v1/complaint/by-complaint-identifier/HWCR/${VALID_HWCR_COMPLAINT_ID}`, requestConfig),
    {
      "getComplaintDetails response status 200": (r) => r.status === 200,
      "getComplaintDetails response contains correct response": (r) =>
        JSON.parse(r.body).id === VALID_HWCR_COMPLAINT_ID,
    },
  );
};

export const addAndRemoveComplaintOutcome = async (host, requestConfig) => {
  const { username, officerGuid } = COS_USER_CREDS;
  // Add an outcome to a complaint to hit case management
  // then delete it so that the process can be repeated.
  const outcomeBody = {
    complaintId: VALID_HWCR_COMPLAINT_ID,
    outcomeAgencyCode: "COS",
    caseCode: "HWCR",
    createUserId: username,
    wildlife: {
      species: "FOX",
      sex: "M",
      age: "ADLT",
      categoryLevel: "",
      identifyingFeatures: "",
      outcome: "TRANSLCTD",
      tags: [],
      drugs: [],
      actions: [{ action: "RECOUTCOME", actor: officerGuid, date: "2024-12-18T08:00:00.000Z" }],
    },
  };
  check(await http.post(host + `/api/v1/complaint-outcome/wildlife`, JSON.stringify(outcomeBody), requestConfig), {
    "addAndRemoveComplaintOutcome create outcome response status 201": (r) => r.status === 201,
  });
  // Fetch the updated complaint to get the outcome ID
  const getComplaintRes = await http.get(host + `/api/v1/complaint-outcome/${VALID_HWCR_COMPLAINT_ID}`, requestConfig);
  const updatedComplaint = JSON.parse(getComplaintRes.body);
  const outcomeId = updatedComplaint.subject?.id;

  // Delete the outcome
  check(
    await http.del(
      host +
        `/api/v1/complaint-outcome/wildlife?complaintOutcomeGuid=${updatedComplaint.complaintOutcomeGuid}&actor=${officerGuid}&updateUserId=${username}&outcomeId=${outcomeId}`,
      undefined,
      requestConfig,
    ),
    {
      // "addAndRemoveComplaintOutcome delete outcome response status 200": (r) => r.status === 200,
      "addAndRemoveComplaintOutcome delete outcome response status 200": (r) => {
        return r.status === 200;
      },
    },
  );
};
