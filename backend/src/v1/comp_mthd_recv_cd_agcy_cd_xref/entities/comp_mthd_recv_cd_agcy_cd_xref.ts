import { Complaint } from "../../complaint/entities/complaint.entity";
import { ComplaintMethodReceivedCode } from "../../complaint_method_received_code/entities/complaint_method_received_code.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Index("PK_comp_mthd_recv_cd_agcy_cd_xref", ["comp_mthd_recv_cd_agcy_cd_xref_guid"], {
  unique: true,
})
@Entity("comp_mthd_recv_cd_agcy_cd_xref")
export class CompMthdRecvCdAgcyCdXref {
  @Column("uuid", {
    primary: true,
    name: "comp_mthd_recv_cd_agcy_cd_xref_guid",
    default: () => "uuid_generate_v4()",
  })
  comp_mthd_recv_cd_agcy_cd_xref_guid: string;

  @ManyToOne(() => ComplaintMethodReceivedCode)
  @JoinColumn({ name: "complaint_method_received_code" })
  complaint_method_received_code: ComplaintMethodReceivedCode;

  @Column("character varying", { name: "agency_code_ref" })
  agency_code_ref: string;

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

  @OneToMany(
    () => Complaint,
    (complaint) => complaint.comp_mthd_recv_cd_agcy_cd_xref.comp_mthd_recv_cd_agcy_cd_xref_guid,
  )
  complaints: Complaint[];
}
