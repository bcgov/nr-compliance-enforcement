import { Column, Entity, Index, OneToMany } from "typeorm";
import { StagingComplaint } from "../../staging_complaint/entities/staging_complaint.entity";

@Index("PK_staging_status_code", ["stagingStatusCode"], { unique: true })
@Entity("staging_status_code", { schema: "complaint" })
export class StagingStatusCode {
  @Column("character varying", {
    primary: true,
    name: "staging_status_code",
    length: 10,
  })
  stagingStatusCode: string;

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

  @OneToMany(() => StagingComplaint, (stagingComplaint) => stagingComplaint.stagingStatusCode)
  stagingComplaints: StagingComplaint[];
}
