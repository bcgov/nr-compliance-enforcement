import { Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { EmailReference } from "../../v1/email_reference/entities/email_reference.entity";

@Injectable()
export class EmailReferenceService {
  private readonly logger = new Logger(EmailReferenceService.name);
  @InjectRepository(EmailReference)
  private readonly emailReferenceRepository: Repository<EmailReference>;

  constructor() {}

  async findActiveByAgency(agencyCode: any): Promise<any> {
    try {
      const data = await this.emailReferenceRepository
        .createQueryBuilder("email_reference")
        .where("email_reference.agency_code_ref = :agency_code", { agency_code: agencyCode })
        .andWhere("email_reference.active_ind is true")
        .getMany();

      return data;
    } catch (error) {
      this.logger.error("Error fetching active email references by agency.", error);
      throw new Error("Error fetching active email references by agency.", error);
    }
  }
}
