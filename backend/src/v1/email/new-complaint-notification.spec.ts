import { EmailReference } from "../email_reference/entities/email_reference.entity";
import {
  buildComplaintUrl,
  buildNewComplaintDetails,
  formatFileSize,
  getAttachmentLimitBytes,
  NewComplaintNotification,
  planAttachments,
  selectNewComplaintRecipients,
  shouldEmailAttachments,
} from "./new-complaint-notification";
import { generateNewComplaintEmailBody } from "../../email_templates/new_chefs_complaint";

const ref = (email_address: string, geo_organization_unit_code?: string) =>
  ({ email_address, geo_organization_unit_code }) as EmailReference;

describe("selectNewComplaintRecipients", () => {
  const references = [
    ref("agency-wide@gov.bc.ca"),
    ref("cariboo@gov.bc.ca", "CRBOTMPSN"),
    ref("kootenay@gov.bc.ca", "EKTNY"),
  ];

  it("uses the agency-wide and zone addresses", () => {
    expect(selectNewComplaintRecipients(references, "CRBOTMPSN")).toEqual([
      "agency-wide@gov.bc.ca",
      "cariboo@gov.bc.ca",
    ]);
  });

  it("uses only the agency-wide addresses when the zone is unknown", () => {
    expect(selectNewComplaintRecipients(references, undefined)).toEqual(["agency-wide@gov.bc.ca"]);
  });

  it("trims and de-duplicates addresses", () => {
    expect(selectNewComplaintRecipients([ref(" a@gov.bc.ca  "), ref("a@gov.bc.ca"), ref("")], "EKTNY")).toEqual([
      "a@gov.bc.ca",
    ]);
  });
});

describe("buildNewComplaintDetails", () => {
  const notification: NewComplaintNotification = {
    complaintId: "26-800000",
    complaintType: "ERS",
    agencyCode: "COS",
    submission: {
      violation_type: "Wildlife",
      cos_area_community: "100 Mile House",
      cos_call_details: "Saw something",
      cos_caller_email: "",
      address_coordinates_lat: "51.6",
      address_coordinates_long: "-121.3",
      chefs_confirmation_id: "EA379825",
    },
  };

  it("lists the filled-in fields with readable labels and skips empty ones", () => {
    expect(buildNewComplaintDetails(notification, undefined, "Some Park")).toEqual([
      { label: "Complaint type", value: "Enforcement" },
      { label: "Violation type", value: "Wildlife" },
      { label: "Community", value: "100 Mile House" },
      { label: "Park", value: "Some Park" },
      { label: "Coordinates (lat, long)", value: "51.6, -121.3" },
      { label: "Call details", value: "Saw something" },
    ]);
  });

  it("prefers the looked-up community name", () => {
    const details = buildNewComplaintDetails(notification, "One Hundred Mile House");
    expect(details.find((detail) => detail.label === "Community")?.value).toBe("One Hundred Mile House");
  });
});

describe("buildComplaintUrl", () => {
  const original = process.env.NATSUITE_URL;
  afterEach(() => {
    process.env.NATSUITE_URL = original;
  });

  it("links to the complaint in NatSuite", () => {
    process.env.NATSUITE_URL = "https://natsuite.example.ca/";
    expect(buildComplaintUrl("ERS", "26-800000")).toBe("https://natsuite.example.ca/complaint/ERS/26-800000");
  });

  it("returns undefined when NATSUITE_URL isn't set", () => {
    delete process.env.NATSUITE_URL;
    expect(buildComplaintUrl("ERS", "26-800000")).toBeUndefined();
  });
});

describe("generateNewComplaintEmailBody", () => {
  it("escapes submitted values and keeps line breaks", () => {
    const body = generateNewComplaintEmailBody({
      complaintId: "26-800000",
      complaintTypeDescription: "Enforcement",
      complaintUrl: "https://natsuite.example.ca/complaint/ERS/26-800000",
      details: [{ label: "Call details", value: "<script>alert(1)</script>\nsecond line" }],
    });

    expect(body).toContain('<a href="https://natsuite.example.ca/complaint/ERS/26-800000">#26-800000</a>');
    expect(body).toContain("&lt;script&gt;alert(1)&lt;/script&gt;<br>second line");
    expect(body).not.toContain("<script>");
  });

  it("shows the complaint number without a link when there is no URL", () => {
    const body = generateNewComplaintEmailBody({
      complaintId: "26-800000",
      complaintTypeDescription: "Enforcement",
      details: [],
    });

    expect(body).toContain("complaint #26-800000 has been submitted");
    expect(body).not.toContain("<a ");
  });
});

describe("planAttachments", () => {
  const MB = 1024 * 1024;
  const file = (id: string, size: number) => ({ id, name: `${id}.jpg`, size });

  it("attaches files in order until the limit, skipping ones that don't fit", () => {
    const { toAttach, tooLarge } = planAttachments(
      [file("a", 4 * MB), file("big", 7 * MB), file("b", 5 * MB), file("c", 2 * MB)],
      10 * MB,
    );

    expect(toAttach.map((attachment) => attachment.id)).toEqual(["a", "b"]);
    expect(tooLarge.map((attachment) => attachment.id)).toEqual(["big", "c"]);
  });

  it("attaches nothing when the limit is 0", () => {
    const { toAttach, tooLarge } = planAttachments([file("a", 1)], 0);
    expect(toAttach).toEqual([]);
    expect(tooLarge).toHaveLength(1);
  });
});

describe("getAttachmentLimitBytes", () => {
  const original = process.env.CHEFS_EMAIL_ATTACHMENT_LIMIT_MB;
  afterEach(() => {
    process.env.CHEFS_EMAIL_ATTACHMENT_LIMIT_MB = original;
  });

  it("defaults to 10 MB", () => {
    delete process.env.CHEFS_EMAIL_ATTACHMENT_LIMIT_MB;
    expect(getAttachmentLimitBytes()).toBe(10 * 1024 * 1024);
  });

  it("can be configured", () => {
    process.env.CHEFS_EMAIL_ATTACHMENT_LIMIT_MB = "20";
    expect(getAttachmentLimitBytes()).toBe(20 * 1024 * 1024);
  });

  it("ignores invalid values", () => {
    process.env.CHEFS_EMAIL_ATTACHMENT_LIMIT_MB = "lots";
    expect(getAttachmentLimitBytes()).toBe(10 * 1024 * 1024);
  });
});

describe("formatFileSize", () => {
  it("shows KB under 1 MB and MB above", () => {
    expect(formatFileSize(0)).toBe("0 KB");
    expect(formatFileSize(200)).toBe("1 KB");
    expect(formatFileSize(3536508)).toBe("3.4 MB");
  });
});

describe("generateNewComplaintEmailBody attachments", () => {
  const base = { complaintId: "26-800000", complaintTypeDescription: "Enforcement", details: [] };

  it("lists attachments and notes the ones that aren't attached", () => {
    const body = generateNewComplaintEmailBody({
      ...base,
      attachments: [
        { name: "<photo>.jpg", size: "2.0 MB", attached: true },
        { name: "video.mp4", size: "40.0 MB", attached: false },
      ],
    });

    expect(body).toContain("<li>&lt;photo&gt;.jpg (2.0 MB)</li>");
    expect(body).toContain("<li>video.mp4 (40.0 MB) <em>- not attached, view it in NatSuite</em></li>");
    expect(body).toContain("Some files were too large to attach or could not be retrieved.");
  });

  it("leaves the section out when there are no attachments", () => {
    expect(generateNewComplaintEmailBody(base)).not.toContain("Attachments");
  });
});

describe("shouldEmailAttachments", () => {
  it("only emails files to NROS", () => {
    expect(shouldEmailAttachments("NROS")).toBe(true);
    expect(shouldEmailAttachments("COS")).toBe(false);
    expect(shouldEmailAttachments("EPO")).toBe(false);
    expect(shouldEmailAttachments("PARKS")).toBe(false);
  });
});
