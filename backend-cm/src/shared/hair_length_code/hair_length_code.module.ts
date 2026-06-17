import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { HairLengthCodeResolver } from "src/shared/hair_length_code/hair_length_code.resolver";
import { HairLengthCodeService } from "src/shared/hair_length_code/hair_length_code.service";

@Module({
  imports: [PrismaModuleShared],
  providers: [HairLengthCodeResolver, HairLengthCodeService],
})
export class HairLengthCodeModule {}
