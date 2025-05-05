import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { get } from "../../external_api/shared_data";
import { ParkDto } from "./dto/park.dto";
import { REQUEST } from "@nestjs/core";
import { DataSource } from "typeorm";

const parkQueryFields: string = `
{
    parkGuid,
    externalId,
    name,
    legalName,
    parkAreas {
      parkAreaGuid
      name
      regionName
    }
}
`;

@Injectable({ scope: Scope.REQUEST })
export class SharedDataService {
  private readonly logger = new Logger(SharedDataService.name);
  private readonly mapper: Mapper;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectMapper() mapper,
    private readonly dataSource: DataSource,
  ) {
    this.mapper = mapper;
  }

  findParks = async (token: string, search: string = "", take: number = 50, skip: number = 0): Promise<ParkDto[]> => {
    const { data, errors } = await get(token, {
      query: `{parks (search: "${search}", take: ${take}, skip: ${skip})
        ${parkQueryFields}
      }`,
    });

    if (errors) {
      this.logger.error("GraphQL errors:", errors);
      throw new Error("GraphQL errors occurred");
    }

    if (data?.parks) {
      return data.parks as ParkDto[];
    } else {
      this.logger.debug(`No results.`);
      return null;
    }
  };

  findOnePark = async (token: string, parkGuid: string): Promise<ParkDto> => {
    const { data, errors } = await get(token, {
      query: `{park (parkGuid: "${parkGuid}")
        ${parkQueryFields}
      }`,
    });

    if (errors) {
      this.logger.error("GraphQL errors:", errors);
      throw new Error("GraphQL errors occurred");
    }

    if (data?.park?.parkGuid) {
      return data.park as ParkDto;
    } else {
      this.logger.debug(`No results.`);
      return null;
    }
  };
}
