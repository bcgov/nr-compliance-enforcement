import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { CreateAttractantHwcrXrefDto } from "./dto/create-attractant_hwcr_xref.dto";
import { UpdateAttractantHwcrXrefDto } from "./dto/update-attractant_hwcr_xref.dto";
import { AttractantHwcrXref } from "./entities/attractant_hwcr_xref.entity";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { REQUEST } from "@nestjs/core";
import { getIdirFromRequest } from "../../common/get-idir-from-request";

@Injectable()
export class AttractantHwcrXrefService {
  private readonly logger = new Logger(AttractantHwcrXrefService.name);
  @InjectRepository(AttractantHwcrXref)
  private attractantHwcrXrefRepository: Repository<AttractantHwcrXref>;

  constructor(@Inject(REQUEST) private request: Request, private dataSource: DataSource) {}

  async create(queryRunner: QueryRunner, createAttractantHwcrXrefDto: CreateAttractantHwcrXrefDto) {
    const createdValue = await this.attractantHwcrXrefRepository.create(createAttractantHwcrXrefDto);
    await queryRunner.manager.save(createdValue);
    return createdValue;
  }

  async findAll(): Promise<AttractantHwcrXref[]> {
    return this.attractantHwcrXrefRepository.find({
      where: { active_ind: true },
      relations: {
        attractant_code: true,
        hwcr_complaint_guid: true,
      },
    });
  }

  async findOne(id: any): Promise<AttractantHwcrXref> {
    return this.attractantHwcrXrefRepository.findOneOrFail({
      where: { attractant_hwcr_xref_guid: id },
      relations: {
        attractant_code: true,
        hwcr_complaint_guid: true,
      },
    });
  }

  update(id: number, updateAttractantHwcrXrefDto: UpdateAttractantHwcrXrefDto) {
    return `This action updates a #${id} attractantHwcrXref`;
  }

  async updateComplaintAttractants(comaplint: HwcrComplaint, attractants: AttractantHwcrXref[]) {
    const idir = getIdirFromRequest(this.request);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      attractants.forEach(async (item) => {
        //-- if there's no xref create a new attractant
        if (!item.attractant_hwcr_xref_guid) {
          const { attractant_code } = item;

          let attractant = new CreateAttractantHwcrXrefDto();
          attractant = {
            ...attractant,
            attractant_code,
            hwcr_complaint_guid: comaplint,
            create_user_id: idir,
          };

          const createdResult = await this.attractantHwcrXrefRepository.create(attractant);
          await queryRunner.manager.save(createdResult);
        } else {
          //-- update the attractant IF its active_ind is false
          const { active_ind: isActive, attractant_hwcr_xref_guid: xrefId } = item;
          if (!isActive) {
            await this.attractantHwcrXrefRepository
              .createQueryBuilder()
              .update(AttractantHwcrXref)
              .set({ active_ind: isActive, update_user_id: idir })
              .where("attractant_hwcr_xref_guid = :xrefId", { xrefId })
              .execute();
          }
        }
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return;
  }

  remove(id: number) {
    return `This action removes a #${id} attractantHwcrXref`;
  }
}
