import { Column, Entity, Index, OneToMany } from "typeorm";
import { StagingMetadataMapping } from "../../staging_meta_data_mapping/entities/staging_meta_data_mapping.entity";

@Index("PK_entity_code", ["entityCode"], { unique: true })
@Entity("entity_code", { schema: "complaint" })
export class EntityCode {
  @Column("character varying", {
    primary: true,
    name: "entity_code",
    length: 10,
  })
  entityCode: string;

  @Column("character varying", { name: "short_description", length: 50 })
  shortDescription: string;

  @Column("character varying", {
    name: "long_description",
    nullable: true,
    length: 250,
  })
  longDescription: string | null;

  @Column("integer", { name: "display_order" })
  displayOrder: number;

  @Column("boolean", { name: "active_ind" })
  activeInd: boolean;

  @Column("character varying", { name: "create_user_id", length: 32 })
  createUserId: string;

  @Column("timestamp without time zone", { name: "create_utc_timestamp" })
  createUtcTimestamp: Date;

  @Column("character varying", { name: "update_user_id", length: 32 })
  updateUserId: string;

  @Column("timestamp without time zone", { name: "update_utc_timestamp" })
  updateUtcTimestamp: Date;

  @OneToMany(() => StagingMetadataMapping, (stagingMetadataMapping) => stagingMetadataMapping.entityCode)
  stagingMetadataMappings: StagingMetadataMapping[];
}
