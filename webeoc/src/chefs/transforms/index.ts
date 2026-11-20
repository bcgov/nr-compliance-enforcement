import { ChefsTransform } from "src/types/chefs/chefs-transform-type";
import { mapCoordinatesTransform } from "./map-coordinates.transform";
import { ChefsSubmissionData } from "src/types/chefs/chefs-submission-type";
import { Complaint } from "src/types/complaint-type";
import { callerNameTransform } from "src/chefs/transforms/name.transform";
import { datetimePickerTransform } from "src/chefs/transforms/datetime-picker.transform";
import { suspectDetailsTransform } from "src/chefs/transforms/suspect-details.transform";
import { callDetailsTransform } from "src/chefs/transforms/call-details.transform";
import { violationTypeTransform } from "src/chefs/transforms/violation-type.transform";

// Transforms run in this order before a CHEFS submission is published as a complaint.
// To add a transform, create a new *.transform.ts file and add it to this list.
const CHEFS_TRANSFORMS: ChefsTransform[] = [
  mapCoordinatesTransform,
  callerNameTransform,
  datetimePickerTransform,
  suspectDetailsTransform,
  callDetailsTransform,
  violationTypeTransform,
];

export const transformChefsSubmission = (data: ChefsSubmissionData): Complaint =>
  CHEFS_TRANSFORMS.reduce((result, transform) => transform(result), data);
