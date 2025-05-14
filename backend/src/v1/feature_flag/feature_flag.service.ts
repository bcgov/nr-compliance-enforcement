import { Inject, Injectable, Logger } from "@nestjs/common";
import { CreateFeatureAgencyXrefDto } from "./dto/create-feature_agency_xref.dto";
import { UpdateFeatureAgencyXrefDto } from "./dto/update-feature_agency_xref.dto";
import { FeatureAgencyXref } from "./entities/feature_agency_xref.entity";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { REQUEST } from "@nestjs/core";
import { UUID } from "crypto";

@Injectable()
export class FeatureFlagService {
  private readonly logger = new Logger(FeatureFlagService.name);
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
      relations: {
        feature_code: true,
        agency_code: true,
      },
      order: {
        agency_code: "ASC",
        feature_code: "ASC",
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
    const data = await this.featureAgencyXrefRepository
      .createQueryBuilder("featureAgencyXref")
      .leftJoinAndSelect(
        "featureAgencyXref.feature_code",
        "featureCode",
        "featureAgencyXref.feature_code = featureCode.feature_code",
      )
      .where("featureAgencyXref.agency_code = :agency_code", { agency_code: agencyCode })
      .getMany();
    const result = data.map((feature) => {
      return {
        id: feature.feature_agency_xref_guid,
        featureCode: feature.feature_code.feature_code,
        shortDesc: feature.feature_code.short_description,
        longDesc: feature.feature_code.long_description,
        isActive: feature.active_ind,
      };
    });
    return result;
  }

  async checkActiveByAgencyAndFeatureCode(agencyCode: any, featureCode: string): Promise<any> {
    const data = await this.featureAgencyXrefRepository
      .createQueryBuilder("featureAgencyXref")
      .leftJoinAndSelect(
        "featureAgencyXref.feature_code",
        "featureCode",
        "featureAgencyXref.feature_code = featureCode.feature_code",
      )
      .where("featureAgencyXref.agency_code = :agency_code", { agency_code: agencyCode })
      .andWhere("featureAgencyXref.feature_code = :feature_code", { feature_code: featureCode })
      .getOne();

    const response = data.active_ind ?? false;
    return response;
  }

  async update(id: UUID, updateFeatureAgencyXrefDto: UpdateFeatureAgencyXrefDto) {
    await this.featureAgencyXrefRepository.update({ feature_agency_xref_guid: id }, updateFeatureAgencyXrefDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} FeatureAgencyXref`;
  }
}
