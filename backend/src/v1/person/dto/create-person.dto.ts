import { PickType } from "@nestjs/swagger";
import { PersonDto } from "./person.dto";

export class CreatePersonDto extends PickType(PersonDto, [
  "first_name",
  "middle_name_1",
  "middle_name_2",
  "last_name",
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
] as const) {}
