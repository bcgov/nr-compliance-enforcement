import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { EntityCode } from "../../entity_code/entities/entity_code.entity";

@Index("PK_staging_metadata_mapping_guid", ["stagingMetadataMappingGuid"], {
  unique: true,
})
@Entity("staging_metadata_mapping", { schema: "complaint" })
export class StagingMetadataMapping {
  @Column("uuid", {
    primary: true,
    name: "staging_metadata_mapping_guid",
    default: () => "uuid_generate_v4()",
  })
  stagingMetadataMappingGuid: string;

  @Column("character varying", { name: "staged_data_value", length: 4000 })
  stagedDataValue: string;

  @Column("character varying", { name: "live_data_value", length: 4000 })
  liveDataValue: string;

  @Column("character varying", { name: "create_user_id", length: 32 })
  createUserId: string;

  @Column("timestamp without time zone", { name: "create_utc_timestamp" })
  createUtcTimestamp: Date;

  @Column("character varying", { name: "update_user_id", length: 32 })
  updateUserId: string;

  @Column("timestamp without time zone", { name: "update_utc_timestamp" })
  updateUtcTimestamp: Date;

  @ManyToOne(() => EntityCode, (entityCode) => entityCode.stagingMetadataMappings)
  @JoinColumn([{ name: "entity_code", referencedColumnName: "entityCode" }])
  entityCode: EntityCode;
}
