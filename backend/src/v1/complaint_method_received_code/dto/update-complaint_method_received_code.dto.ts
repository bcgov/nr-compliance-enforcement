import { PartialType } from "@nestjs/swagger";
import { CreateComplaintMethodReceivedCodeDto } from "./create-complaint_method_received_code";

export class UpdateComplaintMethodReceivedCodeDto extends PartialType(CreateComplaintMethodReceivedCodeDto) {}
