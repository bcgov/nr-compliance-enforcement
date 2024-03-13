import { Controller, Get, Body, Patch, Param, UseGuards, Query, Post } from "@nestjs/common";
import { CaseFileService } from "./case_file.service";
import { Role } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { CaseFileDto } from "src/types/models/case-files/case-file";
import { Token } from "src/auth/decorators/token.decorator";

@UseGuards(JwtRoleGuard)
@ApiTags("case")
@Controller(
    {
        path: "case",
        version: "1",
    })
export class CaseFileController {
    constructor(private readonly service: CaseFileService) { }

    @Post("/create")
    @Roles(Role.COS_OFFICER)
    async create(
        @Token() token,
        @Body() model: CaseFileDto): Promise<CaseFileDto> {
        return await this.service.create(token, model);
    }

    @Patch("/update")
    @Roles(Role.COS_OFFICER)
    async update(
        @Token() token,
        @Body() model: CaseFileDto): Promise<CaseFileDto> {
        return await this.service.update(token, model);
    }

    @Get("/:complaint_id")
    @Roles(Role.COS_OFFICER)
    find(
        @Param("complaint_id") complaint_id: string,
        @Token() token
    ) {
        return this.service.find(complaint_id, token);
    }
}
