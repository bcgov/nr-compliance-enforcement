import { ChefsTransform } from "src/types/chefs/chefs-transform-type";
import { mapCoordinatesTransform } from "./map-coordinates.transform";
import { ChefsSubmissionData } from "src/types/chefs/chefs-submission-type";
import { Complaint } from "src/types/complaint-type";

// Transforms run in this order before a CHEFS submission is published as a complaint.
// To add a transform, create a new *.transform.ts file and add it to this list.
const CHEFS_TRANSFORMS: ChefsTransform[] = [mapCoordinatesTransform];

export const transformChefsSubmission = (data: ChefsSubmissionData): Complaint =>
  CHEFS_TRANSFORMS.reduce((result, transform) => transform(result), data);
