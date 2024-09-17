import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ScheduleSectorXref } from "./entities/schedule_sector_xref.entity";
import { get } from "../../external_api/case_management";

@Injectable()
export class ScheduleSectorXrefService {
  constructor() {}

  findAll = async (token: string): Promise<Array<ScheduleSectorXref>> => {
    let test = 0;
    const { data } = await get(token, {
      query: "{scheduleSectorXrefs{scheduleCode sectorCode }}",
    });
    const results = data.scheduleSectorXrefs.map(({ scheduleCode, sectorCode }) => {
      const xref: ScheduleSectorXref = {
        schedule_code: scheduleCode,
        sector_code: sectorCode,
        active_ind: true,
        create_user_id: "",
        create_utc_timestamp: undefined,
        update_user_id: "",
        update_utc_timestamp: undefined,
        schedule_sector_xref_guid: undefined,
      };
      return xref;
    });
    return results;
  };
}
