import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../../auth/decorators/public.decorator";
import { PublicApiKeyGuard } from "../../auth/publicapikey.guard";
import { PublicService } from "./public.service";

@Public()
@UseGuards(PublicApiKeyGuard)
@ApiTags("public")
@Controller({
  path: "public",
  version: "1",
})
export class PublicController {
  constructor(private readonly service: PublicService) {}

  @Get("/community")
  getCommunities() {
    return this.service.getCommunities();
  }

  @Get("/park")
  getParks() {
    return this.service.getParks();
  }

  @Get("/violation")
  getViolations() {
    return this.service.getViolations();
  }

  @Get("/species")
  getSpecies() {
    return this.service.getSpecies();
  }
}
