import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ViolationAgencyXref } from "./entities/violation_agency_entity_xref";

@Module({
  imports: [TypeOrmModule.forFeature([ViolationAgencyXref])],
})
export class ViolationAgencyXrefModule {}
