import { Inject, Injectable, Logger } from "@nestjs/common";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { REQUEST } from "@nestjs/core";
import { CompMthdRecvCdAgcyCdXref } from "./entities/comp_mthd_recv_cd_agcy_cd_xref";

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
        agency_code: true,
        complaint_method_received_code: true,
      },
    });
  }

  async findOne(id: any): Promise<CompMthdRecvCdAgcyCdXref> {
    return this.compMthdRecvCdAgcyCdXrefRepository.findOneOrFail({
      where: { comp_mthd_recv_cd_agcy_cd_xref_guid: id },
      relations: {
        complaint_method_received_code: true,
        agency_code: true,
      },
    });
  }

  async findBy(agencyCode: any): Promise<CompMthdRecvCdAgcyCdXref[]> {
    return this.compMthdRecvCdAgcyCdXrefRepository.findBy({
      agency_code: agencyCode,
    });
  }
}
