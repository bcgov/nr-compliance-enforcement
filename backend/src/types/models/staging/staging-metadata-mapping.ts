import { UUID } from "node:crypto";
import { EntityCode } from "../code-tables/entity-code";

export interface StagingMetadataMappingDto {
  stagingMetadataMappingGuid: UUID;
  entityCode: EntityCode;
  stagedDataValue: string;
  liveDataValue: string;
  updatedOn: Date;
  createdBy: string;
  updatedBy: string;
}
