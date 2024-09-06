import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CreateCompMthdRecvCdAgcyCdXrefXrefDto } from "./dto/create-comp_mthd_recv_cd_agcy_cd_xref.dto";
import { UpdateCompMthdRecvCdAgcyCdXrefDto } from "./dto/update-comp_mthd_recv_cd_agcy_cd_xref.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("attractant-hwcr-xref")
@Controller({
  path: "attractant-hwcr-xref",
  version: "1",
})
export class CompMthdRecvCdAgcyCdXrefController {
  constructor(private readonly compMthdRecvCdAgcyCdXrefService: CompMthdRecvCdAgcyCdXrefService) {}

  @Post()
  create(@Body() createCompMthdRecvCdAgcyCdXreDto: CreateCompMthdRecvCdAgcyCdXrefXrefDto) {
    //return this.attractantHwcrXrefService.create(createAttractantHwcrXrefDto);
    //this endpoint should not be implemented.
    return "create";
  }

  @Get()
  findAll() {
    return this.compMthdRecvCdAgcyCdXrefService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.compMthdRecvCdAgcyCdXrefService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCompMthdRecvCdAgcyCdXrefDto: UpdateCompMthdRecvCdAgcyCdXrefDto) {
    return this.compMthdRecvCdAgcyCdXrefService.update(+id, updateCompMthdRecvCdAgcyCdXrefDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.compMthdRecvCdAgcyCdXrefService.remove(+id);
  }
}
