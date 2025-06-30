import { Column, Entity, Index } from "typeorm";

@Index("configuration_pk", ["configurationCode"], { unique: true })
@Entity("configuration", { schema: "complaint" })
export class Configuration {
  @Column("character varying", {
    primary: true,
    name: "configuration_code",
    length: 10,
  })
  configurationCode: string;

  @Column("character varying", { name: "configuration_value", length: 250 })
  configurationValue: string;

  @Column("character varying", { name: "long_description", length: 250 })
  longDescription: string;

  @Column("boolean", { name: "active_ind" })
  activeInd: boolean;

  @Column("character varying", { name: "create_user_id", length: 32 })
  createUserId: string;

  @Column("timestamp without time zone", { name: "create_utc_timestamp" })
  createTimestamp: Date;

  @Column("character varying", { name: "update_user_id", length: 32 })
  updateUserId: string;

  @Column("timestamp without time zone", {
    name: "update_utc_timestamp",
    nullable: true,
  })
  updateTimestamp: Date | null;
}
