import { Controller, Delete, Get, Logger, Param, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { ComplaintAttachmentReferenceService } from "./complaint_attachment_reference.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";

@ApiTags("complaint-attachment-reference")
@UseGuards(JwtRoleGuard)
@Controller({
  path: "complaint-attachment-reference",
  version: "1",
})
export class ComplaintAttachmentReferenceController {
  constructor(private readonly complaintAttachmentReferenceService: ComplaintAttachmentReferenceService) {}
  private readonly logger = new Logger(ComplaintAttachmentReferenceController.name);

  @Get("/:id")
  @Roles(coreRoles)
  findByComplaintId(@Param("id") id: string) {
    return this.complaintAttachmentReferenceService.findByComplaintId(id);
  }

  @Get("/file/:id")
  @Roles(coreRoles)
  async getFile(@Param("id") id: UUID, @Res() res: Response): Promise<void> {
    const { data, headers } = await this.complaintAttachmentReferenceService.getFile(id);

    res.set({
      "Content-Type": headers["content-type"],
      "Content-Disposition": headers["content-disposition"],
    });

    res.end(data);
  }

  @Delete("/:id")
  @Roles(coreRoles)
  remove(@Param("id") id: UUID) {
    return this.complaintAttachmentReferenceService.remove(id);
  }
}
