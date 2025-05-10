import { Inject, Injectable, Logger } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { REQUEST } from "@nestjs/core";
import { EmailReference } from "src/v1/email_reference/entities/email_reference.entity";

@Injectable()
export class EmailReferenceService {
  private readonly logger = new Logger(EmailReferenceService.name);
  @InjectRepository(EmailReference)
  private emailReferenceRepository: Repository<EmailReference>;

  constructor(@Inject(REQUEST) private request: Request, private dataSource: DataSource) {}

  async findActiveByAgency(agencyCode: any): Promise<any> {
    try {
      const data = await this.emailReferenceRepository
        .createQueryBuilder("email_reference")
        .where("email_reference.agency_code = :agency_code", { agency_code: agencyCode })
        .andWhere("email_reference.active_ind is true")
        .getMany();

      return data;
    } catch (error) {
      this.logger.error("Error fetching active email references by agency.", error);
      throw new Error("Error fetching active email references by agency.", error);
    }
  }
}
