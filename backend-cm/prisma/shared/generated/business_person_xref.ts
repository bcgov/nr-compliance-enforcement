import { business } from "./business";
import { business_person_xref_code } from "./business_person_xref_code";
import { person } from "./person";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class business_person_xref {
  @ApiProperty({ type: String })
  business_person_xref_guid: string;

  @ApiProperty({ type: String })
  business_guid: string;

  @ApiProperty({ type: String })
  person_guid: string;

  @ApiProperty({ type: String })
  business_person_xref_code: string;

  @ApiProperty({ type: Boolean })
  active_ind: boolean = true;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ type: () => business })
  business: business;

  @ApiProperty({ type: () => business_person_xref_code })
  business_person_xref_code_business_person_xref_business_person_xref_codeTobusiness_person_xref_code: business_person_xref_code;

  @ApiProperty({ type: () => person })
  person: person;
}
