import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class ContactMethodInput {
  @Field(() => String)
  typeCode: string;

  @Field(() => String)
  value: string;
}

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

  @Field(() => [ContactMethodInput], { nullable: true })
  contactMethods?: ContactMethodInput[];
}
