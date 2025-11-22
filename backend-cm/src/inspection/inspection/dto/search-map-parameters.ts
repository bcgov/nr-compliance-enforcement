import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";
import { InspectionFilters } from "./inspection";

@InputType()
export class InspectionSearchMapParameters {
  @Field(() => String, { nullable: true })
  @IsOptional()
  bbox?: string;

  @Field(() => Number)
  zoom: number;

  @Field(() => InspectionFilters, { nullable: true })
  @IsOptional()
  filters?: InspectionFilters;
}
