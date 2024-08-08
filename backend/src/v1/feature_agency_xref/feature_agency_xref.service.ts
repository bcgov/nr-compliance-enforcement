import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { CreateFeatureAgencyXrefDto } from "./dto/create-feature_agency_xref.dto";
import { UpdateFeatureAgencyXrefDto } from "./dto/update-feature_agency_xref.dto";
import { FeatureAgencyXref } from "./entities/feature_agency_xref.entity";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { REQUEST } from "@nestjs/core";
import { getIdirFromRequest } from "../../common/get-idir-from-request";
import { UUID } from "crypto";

@Injectable()
export class FeatureAgencyXrefService {
  private readonly logger = new Logger(FeatureAgencyXrefService.name);
  @InjectRepository(FeatureAgencyXref)
  private featureAgencyXrefRepository: Repository<FeatureAgencyXref>;

  constructor(@Inject(REQUEST) private request: Request, private dataSource: DataSource) {}

  async create(queryRunner: QueryRunner, createFeatureAgencyXrefDto: CreateFeatureAgencyXrefDto) {
    const createdValue = await this.featureAgencyXrefRepository.create(createFeatureAgencyXrefDto);
    queryRunner.manager.save(createdValue);
    return createdValue;
  }

  async findAll(): Promise<FeatureAgencyXref[]> {
    return this.featureAgencyXrefRepository.find({
      where: { active_ind: true },
      relations: {
        feature_code: true,
        agency_code: true,
      },
    });
  }

  async findOne(id: any): Promise<FeatureAgencyXref> {
    return this.featureAgencyXrefRepository.findOneOrFail({
      where: { feature_agency_xref_guid: id },
      relations: {
        feature_code: true,
        agency_code: true,
      },
    });
  }

  async findByAgency(agencyCode: any): Promise<any> {
    // const data = await this.featureAgencyXrefRepository.find({
    //   where: { agency_code: agencyCode },
    //   relations: {
    //     feature_code: true,
    //     agency_code: true,
    //   },
    // });
    // const result: any = data.map((feature) => feature.feature_code);

    const data2 = await this.featureAgencyXrefRepository
      .createQueryBuilder("featureAgencyXref")
      .leftJoinAndSelect(
        "featureAgencyXref.feature_code",
        "featureCode",
        "featureAgencyXref.feature_code = featureCode.feature_code",
      )
      .where("featureAgencyXref.agency_code = :agency_code", { agency_code: agencyCode })
      .getMany();
    const result2 = data2.map((feature) => {
      return {
        id: feature.feature_agency_xref_guid,
        featureCode: feature.feature_code.feature_code,
        shortDesc: feature.feature_code.short_description,
        longDesc: feature.feature_code.long_description,
        isActive: feature.active_ind,
      };
    });
    return result2;
  }

  async update(id: UUID, updateFeatureAgencyXrefDto: UpdateFeatureAgencyXrefDto) {
    await this.featureAgencyXrefRepository.update({ feature_agency_xref_guid: id }, updateFeatureAgencyXrefDto);
    return this.findOne(id);
  }

  // async updateComplaintAttractants(comaplint: HwcrComplaint, attractants: FeatureAgencyXref[]) {
  //   const idir = getIdirFromRequest(this.request);

  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     attractants.forEach(async (item) => {
  //       //-- if there's no xref create a new attractant
  //       if (!item.attractant_hwcr_xref_guid) {
  //         const { attractant_code } = item;

  //         let attractant = new CreateFeatureAgencyXrefDto();
  //         attractant = {
  //           ...attractant,
  //           attractant_code,
  //           hwcr_complaint_guid: comaplint,
  //           create_user_id: idir,
  //         };

  //         const createdResult = await this.FeatureAgencyXrefRepository.create(attractant);
  //         queryRunner.manager.save(createdResult);
  //       } else {
  //         //-- update the attractant IF its active_ind is false
  //         const { active_ind: isActive, attractant_hwcr_xref_guid: xrefId } = item;
  //         if (!isActive) {
  //           await this.FeatureAgencyXrefRepository.createQueryBuilder()
  //             .update(FeatureAgencyXref)
  //             .set({ active_ind: isActive, update_user_id: idir })
  //             .where("attractant_hwcr_xref_guid = :xrefId", { xrefId })
  //             .execute();
  //         }
  //       }
  //     });

  //     await queryRunner.commitTransaction();
  //   } catch (err) {
  //     this.logger.error(err);
  //     throw new BadRequestException(err);
  //   } finally {
  //     await queryRunner.release();
  //   }
  //   return;
  // }

  remove(id: number) {
    return `This action removes a #${id} FeatureAgencyXref`;
  }
}
