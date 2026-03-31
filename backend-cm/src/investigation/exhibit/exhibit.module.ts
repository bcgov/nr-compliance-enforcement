import { Module } from "@nestjs/common";
import { ExhibitService } from "./exhibit.service";
import { ExhibitResolver } from "./exhibit.resolver";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { UserModule } from "../../common/user.module";

@Module({
  imports: [PrismaModuleInvestigation, UserModule],
  providers: [ExhibitResolver, ExhibitService],
})
export class ExhibitModule {}
