import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UUID } from "node:crypto";
import { ComplaintAttachmentReference } from "./entities/complaint_attachment_reference.entity";
import { ChefsService } from "../../external_api/chefs/chefs.service";
import { getIdirFromRequest } from "../../common/get-idir-from-request";

@Injectable({ scope: Scope.REQUEST })
export class ComplaintAttachmentReferenceService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @Inject(ChefsService)
    private readonly _chefsService: ChefsService,
    @InjectRepository(ComplaintAttachmentReference)
    private readonly complaintAttachmentReferenceRepository: Repository<ComplaintAttachmentReference>,
  ) {}

  private readonly logger = new Logger(ComplaintAttachmentReferenceService.name);

  findByComplaintId(id: string): Promise<ComplaintAttachmentReference[]> {
    return this.complaintAttachmentReferenceRepository.find({
      where: {
        complaint_identifier: id,
        active_ind: true,
      },
    });
  }

  async getFile(id: UUID) {
    const reference = await this.findActiveReference(id);

    try {
      return await this._chefsService.getFile(reference.chefs_file_guid_ref);
    } catch (error) {
      this.logger.error(
        `exception: unable to get CHEFS file: ${reference.chefs_file_guid_ref} - status: ${error.response?.status} - error: ${error}`,
      );
      throw new HttpException(`Unable to get file: ${id}`, HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: UUID): Promise<ComplaintAttachmentReference> {
    const reference = await this.findActiveReference(id);

    reference.active_ind = false;
    reference.update_user_id = getIdirFromRequest(this.request);
    reference.update_utc_timestamp = new Date();

    return this.complaintAttachmentReferenceRepository.save(reference);
  }

  private async findActiveReference(id: UUID): Promise<ComplaintAttachmentReference> {
    const reference = await this.complaintAttachmentReferenceRepository.findOneBy({
      complaint_attachment_reference_guid: id,
      active_ind: true,
    });
    if (!reference) {
      throw new NotFoundException();
    }
    return reference;
  }
}
