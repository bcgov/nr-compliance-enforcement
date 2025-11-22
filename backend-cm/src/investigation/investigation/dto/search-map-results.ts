import { Field, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@ObjectType()
export class SearchMapResults {
  @Field(() => GraphQLJSON, { nullable: true })
  clusters?: any;

  @Field(() => Number, { nullable: true })
  mappedCount?: number;

  @Field(() => Number, { nullable: true })
  unmappedCount?: number;

  @Field(() => Number, { nullable: true })
  zoom?: number;

  @Field(() => [Number], { nullable: true })
  center?: Array<number>;
}
