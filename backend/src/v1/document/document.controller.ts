import { Controller, Get, Inject, Param, Query, Res, UseGuards } from "@nestjs/common";
import { DocumentService } from "./document.service";
import { JwtRoleGuard } from "src/auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { Role } from "src/enum/role.enum";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Token } from "src/auth/decorators/token.decorator";
import { COMPLAINT_TYPE } from "src/types/models/complaints/complaint-type";
import { CdogsService } from "src/external_api/cdogs/cdogs.service";
import { Response } from "express";
import { ComplaintService } from "../complaint/complaint.service";
import { constants } from "http2";
@UseGuards(JwtRoleGuard)
@ApiTags("document")
@Controller({ path: "document", version: "1" })
export class DocumentController {
  @Inject(CdogsService)
  readonly cdogsService: CdogsService;

  @Inject(ComplaintService)
  private readonly ceds: ComplaintService;

  constructor(private readonly service: DocumentService) {}

  //--
  //-- exports a complaint to pdf
  //--
  // @Get("/export-complaint/:type")
  // @Roles(Role.COS_OFFICER)
  // async exportComplaint(@Param("type") type: COMPLAINT_TYPE, @Query("id") id: string, @Token() token): Promise<any> {
  //   return this.service.exportComplaint(id, type);
  // }

  // @Get("/export-complaint/:type")
  // @Roles(Role.COS_OFFICER)
  // async exportComplaint(
  //   @Res() res: Response,
  //   @Param("type") type: COMPLAINT_TYPE,
  //   @Query("id") id: string,
  //   @Token() token,
  // ) {
  //   const reportData = await this.ceds.getReportData(id, type);
  //   const response = await this.cdogsService.generate("derp", reportData, type);

  //   if (response && response.status === constants.HTTP_STATUS_OK) {
  //     const { data } = response;

  //     const buffer = Buffer.from(data, "binary");
  //     res.set({
  //       "Content-Type": "application/pdf",
  //       "Content-Disposition": `attachment; filename=awesomefile.pdf`,
  //       "Content-Length": buffer.length,
  //     });

  //     res.send(buffer);
  //   }
  // }

  @Get("/export-complaint/:type")
  @Roles(Role.COS_OFFICER)
  async exportComplaint(
    @Res() res: Response,
    @Param("type") type: COMPLAINT_TYPE,
    @Query("id") id: string,
    @Token() token,
  ) {
    const reportData = await this.ceds.getReportData(id, type);
    const response = await this.cdogsService.generate("derp", reportData, type);

    ["Content-Disposition", "Content-Type", "Content-Length", "Content-Transfer-Encoding", "X-Report-Name"].forEach(
      (h) => {
        console.log(response.headers[h.toLowerCase()]);
        res.setHeader(h, response.headers[h.toLowerCase()]);
      },
    );

    res.send(response.data);
    return;
  }

  ///      const data = await this.ceds.getReportData(id, type);

  // @Get("/export-complaint/:type")
  // @Roles(Role.COS_OFFICER)
  // @Header("Content-Type", "application/json")
  // @Header("Content-Disposition", 'attachment; filename="package.json"')
  // async exportComplaint(
  //   @Param("type") type: COMPLAINT_TYPE,
  //   @Query("id") id: string,
  //   @Token() token,
  // ): Promise<StreamableFile> {
  //   const data = await this.service.exportComplaint(id, type);
  //   // const file = createReadStream(data);
  //   return data;
  // }

  // @Get("/export-complaint/:type")
  // @Roles(Role.COS_OFFICER)
  // @Header("Content-Type", "application/json")
  // @Header("Content-Disposition", 'attachment; filename="package.json"')
  // async exportComplaint(
  //   @Param("type") type: COMPLAINT_TYPE,
  //   @Query("id") id: string,
  //   @Token() token,
  //   @Res() res: Response,
  // ): Promise<any> {
  //   try {
  //     const result = await this.service.exportComplaint(id, type);

  //     let buffer = Buffer.from(result, "base64");
  //     // let stream = new Readable();
  //     // stream.push(buffer);
  //     // stream.pipe(fs.createWriteStream("test.pdf"));
  //     // let derp = "";

  //     // stream.pipe(res);
  //     res.send(buffer);
  //     return Promise.resolve("test");
  //   } catch (error) {
  //     console.log("Error generating complaint:", error);
  //   }

  //   return "";
  // }
}
