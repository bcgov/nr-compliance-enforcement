import { Injectable } from '@nestjs/common';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigurationService {
  create(createConfigurationDto: CreateConfigurationDto) {
    return 'This action adds a new configuration';
  }

  findAll() {
    return `This action returns all configuration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} configuration`;
  }

  update(id: number, updateConfigurationDto: UpdateConfigurationDto) {
    return `This action updates a #${id} configuration`;
  }
}
