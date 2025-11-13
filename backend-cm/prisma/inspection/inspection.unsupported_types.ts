// Extension for generated inspection class to add fields that prisma-class-generator skips
// This file won't be overwritten by `prisma generate`

import { inspection as GeneratedInspection } from "./generated/inspection";
import { Point } from "../../src/common/custom_scalars";

// We name this to match the generated class casing and disable sonar for this
export interface inspection extends GeneratedInspection {
  // NOSONAR
  location_geometry_point?: Point;
}
