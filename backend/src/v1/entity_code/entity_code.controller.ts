import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntityCodeService } from './entity_code.service';
import { CreateEntityCodeDto } from './dto/create-entity_code.dto';
import { UpdateEntityCodeDto } from './dto/update-entity_code.dto';

@Controller('entity-code')
export class EntityCodeController {
  constructor(private readonly entityCodeService: EntityCodeService) {}

  @Post()
  create(@Body() createEntityCodeDto: CreateEntityCodeDto) {
    return this.entityCodeService.create(createEntityCodeDto);
  }

  @Get()
  findAll() {
    return this.entityCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entityCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntityCodeDto: UpdateEntityCodeDto) {
    return this.entityCodeService.update(+id, updateEntityCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entityCodeService.remove(+id);
  }
}
