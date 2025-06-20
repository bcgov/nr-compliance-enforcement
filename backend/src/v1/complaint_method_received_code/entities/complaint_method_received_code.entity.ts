import { Column, Entity, Index } from "typeorm";

@Index("PK_complaint_method_received_code", ["complaint_method_received_code"], {
  unique: true,
})
@Entity("complaint_method_received_code", { schema: "complaint" })
export class ComplaintMethodReceivedCode {
  @Column("character varying", {
    primary: true,
    name: "complaint_method_received_code",
    length: 10,
  })
  complaint_method_received_code: string;

  @Column("character varying", { name: "short_description", length: 50 })
  short_description: string;

  @Column("character varying", {
    name: "long_description",
    nullable: true,
    length: 250,
  })
  long_description: string | null;

  @Column("integer", { name: "display_order" })
  display_order: number;

  @Column("boolean", { name: "active_ind" })
  active_ind: boolean;

  @Column("character varying", { name: "create_user_id", length: 32 })
  create_user_id: string;

  @Column("timestamp without time zone", { name: "create_utc_timestamp" })
  create_utc_timestamp: Date;

  @Column("character varying", { name: "update_user_id", length: 32 })
  update_user_id: string;

  @Column("timestamp without time zone", { name: "update_utc_timestamp" })
  update_utc_timestamp: Date;
}
