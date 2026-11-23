import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplaintAttachmentReferenceService } from "./complaint_attachment_reference.service";
import { ComplaintAttachmentReferenceController } from "./complaint_attachment_reference.controller";
import { ComplaintAttachmentReference } from "./entities/complaint_attachment_reference.entity";
import { ChefsModule } from "../../external_api/chefs/chefs.module";

@Module({
  imports: [TypeOrmModule.forFeature([ComplaintAttachmentReference]), ChefsModule],
  controllers: [ComplaintAttachmentReferenceController],
  providers: [ComplaintAttachmentReferenceService],
  exports: [ComplaintAttachmentReferenceService],
})
export class ComplaintAttachmentReferenceModule {}
