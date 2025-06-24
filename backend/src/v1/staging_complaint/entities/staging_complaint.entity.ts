import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { StagingActivityCode } from "../../staging_activity_code/entities/staging_activity_code.entity";
import { StagingStatusCode } from "../../staging_status_code/entities/staging_status_code.entity";

@Index("PK_staging_complaint", ["stagingComplaintGuid"], { unique: true })
@Entity("staging_complaint", { schema: "complaint" })
export class StagingComplaint {
  @Column("uuid", {
    primary: true,
    name: "staging_complaint_guid",
    default: () => "uuid_generate_v4()",
  })
  stagingComplaintGuid: string;

  @Column("character varying", { name: "complaint_identifier", length: 20 })
  complaintIdentifer: string;

  @Column("jsonb", { name: "complaint_jsonb" })
  complaintJsonb: object;

  @Column("character varying", { name: "create_user_id", length: 32 })
  createUserId: string;

  @Column("timestamp without time zone", { name: "create_utc_timestamp" })
  createUtcTimestamp: Date;

  @Column("character varying", { name: "update_user_id", length: 32 })
  updateUserId: string;

  @Column("timestamp without time zone", { name: "update_utc_timestamp" })
  updateUtcTimestamp: Date;

  @ManyToOne(() => StagingActivityCode, (stagingActivityCode) => stagingActivityCode.stagingComplaints)
  @JoinColumn([
    {
      name: "staging_activity_code",
      referencedColumnName: "stagingActivityCode",
    },
  ])
  stagingActivityCode: StagingActivityCode;

  @ManyToOne(() => StagingStatusCode, (stagingStatusCode) => stagingStatusCode.stagingComplaints)
  @JoinColumn([{ name: "staging_status_code", referencedColumnName: "stagingStatusCode" }])
  stagingStatusCode: StagingStatusCode;
}
