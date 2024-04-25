import { Module } from "@nestjs/common";
import { EntityCode } from "./entities/entity_code.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([EntityCode])],
})
export class EntityCodeModule {}
