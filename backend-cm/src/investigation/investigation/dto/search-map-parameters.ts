import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";
import { InvestigationFilters } from "./investigation";

@InputType()
export class SearchMapParameters {
  @Field(() => String, { nullable: true })
  @IsOptional()
  bbox?: string;

  @Field(() => Number)
  zoom: number;

  @Field(() => InvestigationFilters, { nullable: true })
  @IsOptional()
  filters?: InvestigationFilters;
}
