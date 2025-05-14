import { Module } from "@nestjs/common";
import { EmailReferenceService } from "./email_reference.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailReference } from "./entities/email_reference.entity";

@Module({
  imports: [TypeOrmModule.forFeature([EmailReference])],
  providers: [EmailReferenceService],
  exports: [EmailReferenceService],
})
export class EmailReferenceModule {}
