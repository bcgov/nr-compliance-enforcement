import { Injectable } from '@nestjs/common';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { Configuration } from './entities/configuration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ConfigurationService {

  constructor(
    @InjectRepository(Configuration)
    private configurationRepository: Repository<Configuration>
  ) {}

  findAll() {
    return this.configurationRepository.find();
  }

  findOne(configurationCode: string): Promise<Configuration[]> {
    return this.configurationRepository.findBy({configurationCode});
  }

  update(id: number, updateConfigurationDto: UpdateConfigurationDto) {
    return `This action updates a #${id} configuration`;
  }
}
