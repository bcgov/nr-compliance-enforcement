import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class ParkAreaInput {
  @Field(() => String)
  parkAreaGuid?: string;

  @Field(() => String)
  name?: string;

  @Field(() => String, { nullable: true })
  regionName?: string;
}
