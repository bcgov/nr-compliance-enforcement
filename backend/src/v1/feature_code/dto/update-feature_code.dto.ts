import { PartialType } from "@nestjs/swagger";
import { CreateFeatureCodeDto } from "./create-feature_code.dto";

export class UpdateFeatureCodeDto extends PartialType(CreateFeatureCodeDto) {}
