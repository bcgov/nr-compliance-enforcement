import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Complaint } from "../../complaint/entities/complaint.entity";
import { Entity, Column, OneToOne, JoinColumn, Unique, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { SpeciesCode } from "../../species_code/entities/species_code.entity";
import { HwcrComplaintNatureCode } from "../../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { AttractantHwcrXref } from "../../attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";

@Entity()
@Unique(["complaint_identifier"])
export class HwcrComplaint
{
    @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The Unique identifier for the allegation",
      })
      @PrimaryGeneratedColumn("uuid")
      hwcr_complaint_guid: UUID;
    
      @ApiProperty({ example: "COS-5436", description: "The complaint this HWCR complaint references" })
      @OneToOne(() => Complaint)
      @JoinColumn({name: "complaint_identifier"})
      complaint_identifier: Complaint;
    
      @ApiProperty({ example: "INV", description: "The species code for this HWCR complaint" })
      @ManyToOne(() => SpeciesCode)
      @JoinColumn({name: "species_code"})
      species_code: SpeciesCode;

      @ApiProperty({ example: "INV", description: "The species code for this HWCR complaint" })
      @ManyToOne(() => HwcrComplaintNatureCode, { nullable: true })
      @JoinColumn({name: "hwcr_complaint_nature_code"})
      hwcr_complaint_nature_code: HwcrComplaintNatureCode;

      @OneToMany(() => AttractantHwcrXref, attractant_hwcr_xref => attractant_hwcr_xref.hwcr_complaint)
      @JoinColumn({name: "hwcr_complaint"})
      attractant_hwcr_xref: AttractantHwcrXref[];
    
      @ApiProperty({
        example: "Witnessed individual dumping garbage on crown land",
        description: "The details the witness has reported about this HWCR complaint",
      })
      @Column( {length: 4000, nullable: true})
      other_attractants_text: string;
    
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
   
      constructor(complaint_identifier?: Complaint, species_code?: SpeciesCode, hwcr_complaint_nature_code?: HwcrComplaintNatureCode, attractant_hwcr_xref?: AttractantHwcrXref[], other_attractants_text?: string, 
        create_user_id?: string, create_user_guid?: UUID, create_timestamp?: Date, update_user_id?: string, update_user_guid?: UUID, update_timestamp?: Date) {
        this.complaint_identifier = complaint_identifier;
        this.species_code = species_code;
        this.hwcr_complaint_nature_code = hwcr_complaint_nature_code;
        this.attractant_hwcr_xref = attractant_hwcr_xref;
        this.other_attractants_text = other_attractants_text;
        this.create_user_id = create_user_id;
        this.create_user_guid = create_user_guid;
        this.create_timestamp = create_timestamp;
        this.update_user_id = update_user_id;
        this.update_user_guid = update_user_guid;
        this.update_timestamp = update_timestamp;
      }
}
