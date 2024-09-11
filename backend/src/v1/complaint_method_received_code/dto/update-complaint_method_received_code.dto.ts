import { PartialType } from "@nestjs/swagger";
import { ComplaintMethodReceivedCodeDto } from "./complaint_method_received_code.dto";

export class UpdateComplaintMethodReceivedCodeDto extends PartialType(ComplaintMethodReceivedCodeDto) {}
