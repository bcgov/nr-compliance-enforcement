import { Inject, Injectable, Logger } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { REQUEST } from "@nestjs/core";
import { CompMthdRecvCdAgcyCdXref } from "./entities/comp_mthd_recv_cd_agcy_cd_xref";
import { ComplaintMethodReceivedCode } from "../complaint_method_received_code/entities/complaint_method_received_code.entity";

@Injectable()
export class CompMthdRecvCdAgcyCdXrefService {
  private readonly logger = new Logger(CompMthdRecvCdAgcyCdXrefService.name);
  @InjectRepository(CompMthdRecvCdAgcyCdXref)
  private compMthdRecvCdAgcyCdXrefRepository: Repository<CompMthdRecvCdAgcyCdXref>;

  constructor(@Inject(REQUEST) private request: Request, private dataSource: DataSource) {}

  async findAll(): Promise<CompMthdRecvCdAgcyCdXref[]> {
    return this.compMthdRecvCdAgcyCdXrefRepository.find({
      where: { active_ind: true },
      relations: {
        complaint_method_received_code: true,
      },
    });
  }

  async findOne(id: any): Promise<CompMthdRecvCdAgcyCdXref> {
    return this.compMthdRecvCdAgcyCdXrefRepository.findOneOrFail({
      where: { comp_mthd_recv_cd_agcy_cd_xref_guid: id },
      relations: {
        complaint_method_received_code: true,
      },
    });
  }

  async findBy(agencyCode: any): Promise<ComplaintMethodReceivedCode[]> {
    const results = await this.compMthdRecvCdAgcyCdXrefRepository.find({
      where: {
        agency_code_ref: agencyCode,
        active_ind: true,
      },
      relations: ["complaint_method_received_code"],
    });

    return results.map((xref) => xref.complaint_method_received_code);
  }

  async findByComplaintMethodReceivedCodeAndAgencyCode(
    complaintMethodReceivedCode: string,
    agencyCode: string,
  ): Promise<CompMthdRecvCdAgcyCdXref | null> {
    const result = await this.compMthdRecvCdAgcyCdXrefRepository
      .createQueryBuilder("xref")
      .leftJoinAndSelect("xref.complaint_method_received_code", "complaintMethodReceivedCode")
      .where("complaintMethodReceivedCode.complaint_method_received_code = :code", {
        code: complaintMethodReceivedCode,
      })
      .andWhere("xref.agency_code_ref = :agencyCode", { agencyCode: agencyCode })
      .andWhere("xref.active_ind = :active", { active: true })
      .getOne();

    return result;
  }
}
