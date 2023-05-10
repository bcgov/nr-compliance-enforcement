import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Complaint } from "src/v1/complaint/entities/complaint.entity";
import { ViolationCode } from "src/v1/violation_code/entities/violation_code.entity";
import { Entity, Column, OneToOne, JoinColumn, Unique, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
@Unique(["complaint_identifier"])
export class AllegationComplaint
{
    @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The Unique identifier for the allegation",
      })
      @PrimaryGeneratedColumn("uuid")
      allegation_complaint_guid: UUID;
    
      @ApiProperty({ example: "COS-5436", description: "The complaint this allegation references" })
      @OneToOne(() => Complaint)
      @JoinColumn({name: "complaint_identifier"})
      complaint_identifier: Complaint;
    
      @ApiProperty({ example: "INV", description: "The violation code for this allegation" })
      @ManyToOne(() => ViolationCode, { nullable: true })
      @JoinColumn({name: "violation_code"})
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
      @Column( {length: 255, nullable: true})
      suspect_witnesss_dtl_text: string;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the violation",
      })
      @Column({length: 32})
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the violation",
      })
      @Column({type: "uuid"})
      create_user_guid: UUID;
    
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
      @Column({length: 32})
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the violation",
      })
      @Column({type: "uuid"})
      update_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the violation was last updated",
      })
      @Column()
      update_timestamp: Date;
    
      constructor() {

      }
}
