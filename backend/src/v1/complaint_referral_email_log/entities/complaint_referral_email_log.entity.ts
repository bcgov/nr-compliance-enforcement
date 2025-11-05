import { UUID } from "node:crypto";
import { ComplaintReferral } from "../../complaint_referral/entities/complaint_referral.entity";
import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";

@Index("PK_refemailog", ["complaint_referral_email_log_guid"], {
  unique: true,
})
@Entity({ name: "complaint_referral_email_log", schema: "complaint" })
export class ComplaintReferralEmailLog {
  @Column("uuid", {
    primary: true,
    name: "complaint_referral_email_log_guid",
    default: () => "uuid_generate_v4()",
  })
  complaint_referral_email_log_guid: UUID;

  @Column("character varying", { length: 256, name: "email_address" })
  email_address: string;

  @Column("timestamp without time zone", { name: "email_sent_utc_timestamp" })
  email_sent_utc_timestamp: Date;

  @Column("character varying", { length: 32, name: "create_user_id" })
  create_user_id: string;

  @Column("timestamp without time zone", { name: "create_utc_timestamp" })
  create_utc_timestamp: Date;

  @Column("character varying", { length: 32, name: "update_user_id" })
  update_user_id: string;

  @Column("timestamp without time zone", { name: "update_utc_timestamp" })
  update_utc_timestamp: Date;

  @ManyToOne(() => ComplaintReferral, (referral) => referral.complaint_referral_guid)
  @JoinColumn({ name: "complaint_referral_guid" })
  complaint_referral_guid: ComplaintReferral;
}
