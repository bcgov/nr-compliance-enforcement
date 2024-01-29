import { Module } from '@nestjs/common';
import { EntityCodeService } from './entity_code.service';
import { EntityCodeController } from './entity_code.controller';
import { EntityCode } from './entities/entity_code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EntityCode])],
  controllers: [EntityCodeController],
  providers: [EntityCodeService]
})
export class EntityCodeModule {}
