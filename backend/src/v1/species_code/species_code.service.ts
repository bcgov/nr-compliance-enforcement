import { Injectable } from '@nestjs/common';
import { CreateSpeciesCodeDto } from './dto/create-species_code.dto';
import { UpdateSpeciesCodeDto } from './dto/update-species_code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SpeciesCode } from './entities/species_code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpeciesCodeService {
  constructor(
    @InjectRepository(SpeciesCode)
    private speciesCodeRepository: Repository<SpeciesCode>
  ) {}

  async create(speciesCode: CreateSpeciesCodeDto): Promise<SpeciesCode> {
    const newspeciesCode = this.speciesCodeRepository.create(speciesCode);
    await this.speciesCodeRepository.save(newspeciesCode);
    return newspeciesCode;
  }

  async findAll(): Promise<SpeciesCode[]> {
    return this.speciesCodeRepository.find();
  }

  async findOne(id: any): Promise<SpeciesCode> {
    return this.speciesCodeRepository.findOneOrFail(id);
  }

  async update(species_code: string, updatespeciesCodeDto: UpdateSpeciesCodeDto): Promise<SpeciesCode> {
    await this.speciesCodeRepository.update({ species_code }, updatespeciesCodeDto);
    return this.findOne(species_code);
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.speciesCodeRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
