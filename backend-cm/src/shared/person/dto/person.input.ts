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
  middleName?: string;

  @Field(() => String, { nullable: true })
  middleName2?: string;

  @Field(() => String)
  lastName: string;

  @Field(() => [ContactMethodInput], { nullable: true })
  contactMethods?: ContactMethodInput[];
}
