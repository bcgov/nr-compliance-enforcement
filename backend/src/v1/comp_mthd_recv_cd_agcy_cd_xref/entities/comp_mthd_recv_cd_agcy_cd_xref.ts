import { Complaint } from "src/v1/complaint/entities/complaint.entity";
import { Column, Entity, Index, OneToMany } from "typeorm";

@Index("PK_comp_mthd_recv_cd_agcy_cd_xref", ["compMthdRecvCdAgcyCdXrefGuid"], {
  unique: true,
})
@Entity("comp_mthd_recv_cd_agcy_cd_xref", { schema: "public" })
export class CompMthdRecvCdAgcyCdXref {
  @Column("uuid", {
    primary: true,
    name: "comp_mthd_recv_cd_agcy_cd_xref_guid",
    default: () => "uuid_generate_v4()",
  })
  comp_mthd_recv_cd_agcy_cd_xref_guid: string;

  @Column("character varying", { name: "agency_code", length: 10 })
  agency_code: string;

  @Column("character varying", {
    name: "complaint_method_received_code",
    length: 10,
  })
  complaint_method_received_code: string;

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

  @OneToMany(() => Complaint, (complaint) => complaint.compMthdRecvCdAgcyCdXrefGuid)
  complaints: Complaint[];
}
