import { ApiProperty } from "@nestjs/swagger";

export class ConfigurationDto {
  @ApiProperty({
    example: "DFLTPGE",
    description: "A human readable code used to identify an configuration entry",
  })
  configurationCode: string;

  @ApiProperty({
    example: "50",
    description: "The value of the configuration entry.",
  })
  configurationValue: string;

  @ApiProperty({
    example: "Default Page Count",
    description: "The default number of rows per page when displaying lists within the application.",
  })
  longDescription: string;

  @ApiProperty({
    example: "true",
    description: "A boolean indicator to determine if the configuration_entry is active.",
  })
  activeInd: boolean;

  @ApiProperty({
    example: "bfalk",
    description: "The id of the user that created the configuration entry.",
  })
  createUserId: string;

  @ApiProperty({
    example: "2020-01-01 08:12:12",
    description:
      "The timestamp when the configuration entry was created.  The timestamp is stored in UTC with no Offset.",
  })
  createTimestamp: Date;

  @ApiProperty({
    example: "bfalk",
    description: "The id of the user that updated the configuration entry.",
  })
  updateUserId: string;

  @ApiProperty({
    example: "2020-01-01 08:12:12",
    description:
      "The timestamp when the configuration entry was updated.  The timestamp is stored in UTC with no Offset.",
  })
  updateTimestamp: Date | null;
}
