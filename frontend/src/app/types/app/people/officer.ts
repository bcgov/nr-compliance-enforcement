import { UUID } from "crypto";
import { CosGeoOrgUnit } from "../../person/person";
import { Person } from "./person";

export interface OfficerDto {
  id: UUID;
  userId: string;
  authorizedUserId: string;
  office?: OfficeDto;
  person: Person;
}

export interface OfficeDto extends CosGeoOrgUnit {
  id: UUID;
}
