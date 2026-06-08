import { InputType, Field } from "@nestjs/graphql";
import { AliasInput } from "../../alias/dto/alias";

@InputType()
export class PersonInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String, { nullable: true })
  middleNames?: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Date, { nullable: true })
  dateOfBirth?: Date;

  @Field(() => String, { nullable: true })
  approximateAgeCode?: string;

  @Field(() => String, { nullable: true })
  driversLicenseNumber?: string;

  @Field(() => String, { nullable: true })
  driversLicenseClass?: string;

  @Field(() => String, { nullable: true })
  driversLicenseCountryCode?: string;

  @Field(() => String, { nullable: true })
  driversLicenseCountrySubdivisionCode?: string;

  @Field(() => String, { nullable: true })
  genderCode?: string;

  @Field(() => [AliasInput], { nullable: true })
  aliases?: AliasInput[];

  @Field(() => String, { nullable: true })
  complexionCode?: string;

  @Field(() => String, { nullable: true })
  buildCode?: string;

  @Field(() => String, { nullable: true })
  hairColourCode?: string;

  @Field(() => String, { nullable: true })
  hairLengthCode?: string;

  @Field(() => String, { nullable: true })
  hairColourOther?: string;

  @Field(() => String, { nullable: true })
  eyeColourCode?: string;

  @Field(() => String, { nullable: true })
  eyeColourOther?: string;
}
