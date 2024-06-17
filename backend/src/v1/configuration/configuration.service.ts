import { Inject, Injectable } from "@nestjs/common";
import { UpdateConfigurationDto } from "./dto/update-configuration.dto";
import { Configuration } from "./entities/configuration.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { getIdirFromRequest } from "../../common/get-idir-from-request";

@Injectable()
export class ConfigurationService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Configuration)
    private configurationRepository: Repository<Configuration>,
  ) {}

  findAll() {
    return this.configurationRepository.find();
  }

  findOne(configurationCode: string): Promise<Configuration[]> {
    return this.configurationRepository.findBy({ configurationCode });
  }

  update(id: number, updateConfigurationDto: UpdateConfigurationDto) {
    return `This action updates a #${id} configuration`;
  }

  findByCode = async (code: string): Promise<Configuration> => {
    return this.configurationRepository.findOneBy({ configurationCode: code });
  };

  updateByCode = async (code: string, value: string): Promise<Configuration> => {
    const idir = getIdirFromRequest(this.request);

    await this.configurationRepository
      .createQueryBuilder("config")
      .update()
      .set({
        configurationValue: value,
        updateUserId: idir,
        updateTimestamp: new Date(),
      })
      .where("configurationCode = :code", { code })
      .execute();

    return this.configurationRepository.findOneBy({ configurationCode: code });
  };
}
