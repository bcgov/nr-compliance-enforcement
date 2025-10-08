// Extension for generated investigation class to add fields that prisma-class-generator skips
// This file won't be overwritten by `prisma generate`

import { investigation as GeneratedInvestigation } from './generated/investigation';
import { Point } from '../../src/common/custom_scalars';

export interface investigation extends GeneratedInvestigation {
  location_geometry_point?: Point;
}
