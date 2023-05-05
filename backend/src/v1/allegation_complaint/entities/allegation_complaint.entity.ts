import { ApiProperty } from "@nestjs/swagger";
import { Complaint } from "src/v1/complaint/entities/complaint.entity";
import { ViolationCode } from "src/v1/violation_code/entities/violation_code.entity";
import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, Unique } from "typeorm";

@Entity()
@Unique(["complaint_id"])
export class AllegationComplaint 
{
    @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The Unique identifier for the allegation",
      })
      @PrimaryColumn()
      alegation_complaint_guid: string;
    
      @ApiProperty({ example: "1", description: "The complaint this allegation references" })
      @OneToOne(() => Complaint)
      @JoinColumn()
      complaint_id: Complaint;
    
      @ApiProperty({ example: "INV", description: "The violation code for this allegation" })
      @OneToOne(() => ViolationCode, { nullable: true })
      @JoinColumn()
      violation_code: ViolationCode;
    
      @ApiProperty({ example: "True", description: "An indicator to determine if the allegation is in progress" })
      @Column()
      in_progress_ind: boolean;

      @ApiProperty({ example: "True", description: "An indicator to show if the allegation was observed" })
      @Column()
      observed_ind: boolean;

      @ApiProperty({
        example: "Witnessed individual dumping garbage on crown land",
        description: "The details the witness has reported about this allegation",
      })
      @Column({ nullable: true })
      suspect_witnesss_dtl_text: string;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the violation",
      })
      @Column()
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the violation",
      })
      @Column()
      create_user_guid: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the violation was created",
      })
      @Column()
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the violation",
      })
      @Column()
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the violation",
      })
      @Column()
      update_user_guid: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the violation was last updated",
      })
      @Column()
      update_timestamp: Date;
    
      constructor() {
    
      }
}
