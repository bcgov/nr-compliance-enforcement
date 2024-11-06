import { Module } from "@nestjs/common";
import { OfficerService } from "./officer.service";
import { PersonService } from "../person/person.service";
import { OfficeService } from "../office/office.service";
import { OfficerController } from "./officer.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Officer } from "./entities/officer.entity";
import { Person } from "../person/entities/person.entity";
import { Office } from "../office/entities/office.entity";
import { CssModule } from "src/external_api/css/css.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Officer]),
    TypeOrmModule.forFeature([Person]),
    TypeOrmModule.forFeature([Office]),
    CssModule,
  ],
  controllers: [OfficerController],
  providers: [OfficerService, PersonService, OfficeService],
  exports: [OfficerService],
})
export class OfficerModule {}
