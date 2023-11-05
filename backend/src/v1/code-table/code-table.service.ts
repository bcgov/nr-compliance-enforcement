import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import CodeTable, { Agency, Attractant } from "../../types/models/code-tables";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";

@Injectable()
export class CodeTableService {
  private readonly logger = new Logger(CodeTableService.name);

  @InjectRepository(AgencyCode)
  private _agencyRepository: Repository<AgencyCode>;
  @InjectRepository(AttractantCode)
  private _attractantRepository: Repository<AttractantCode>;

  getCodeTableByName = async (table: string): Promise<CodeTable[]> => {
    switch (table) {
      case "agency": {
        const data = await this._agencyRepository.find();
        let results = data.map(
          ({
            agency_code,
            short_description,
            long_description,
            display_order,
            active_ind,
          }) => {
            let table: Agency = {
              agencyCode: agency_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          }
        );

        return results;
      }
      case "attractant": {
        const data = await this._attractantRepository.find();
        let results = data.map(
          ({
            attractant_code,
            short_description,
            long_description,
            display_order,
            active_ind,
          }) => {
            let table: Attractant = {
              attractantCode: attractant_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind,
            };
            return table;
          }
        );
        return results;
      }
    }
  };
}
