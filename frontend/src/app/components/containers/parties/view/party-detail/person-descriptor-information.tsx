import { cmToFeetInches, kgToLb } from "@/app/components/containers/parties/form/party-form-utils";
import {
  DetailField,
  DetailSection,
} from "@/app/components/containers/parties/view/party-detail/party-detail-primatives";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable } from "@/app/store/reducers/code-table";
import { BuildType } from "@/app/types/app/code-tables/build";
import { ComplexionType } from "@/app/types/app/code-tables/complexion";
import { EyeColourType } from "@/app/types/app/code-tables/eye-colour";
import { FacialHairStyleType } from "@/app/types/app/code-tables/facial-hair-style";
import { HairColourType } from "@/app/types/app/code-tables/hair-colour";
import { HairLengthType } from "@/app/types/app/code-tables/hair-length";
import { InvestigationPerson, Person } from "@/generated/graphql";
import { FC } from "react";

interface PersonDescriptorInformationProps {
  person: Person | InvestigationPerson;
}

const yesNo = (indicator: boolean | null | undefined): string | undefined => {
  if (indicator === null || indicator === undefined) return undefined;
  return indicator ? "Yes" : "No";
};

export const PersonDescriptorInformation: FC<PersonDescriptorInformationProps> = ({ person }) => {
  const complexionCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLEXION));
  const buildCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.BUILD));
  const hairColourCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.HAIR_COLOUR));
  const hairLengthCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.HAIR_LENGTH));
  const eyeColourCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.EYE_COLOUR));
  const facialHairStyleCodeTable = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.FACIAL_HAIR_STYLE));

  const imperialHeight = cmToFeetInches(person?.heightInCm ?? 0);

  const heightDisplay = person?.heightInCm
    ? `${person.heightInCm} cm (${imperialHeight.feet} feet ${imperialHeight.inches} inches)`
    : undefined;
  const weightDisplay = person?.weightInKg ? `${person.weightInKg} kg (${kgToLb(person.weightInKg)} lbs)` : undefined;

  const complexion = person?.complexionCode
    ? (complexionCodes?.find((code: ComplexionType) => code.complexionCode === person.complexionCode)
        ?.shortDescription ?? person.complexionCode)
    : undefined;

  const build = person?.buildCode
    ? (buildCodes?.find((code: BuildType) => code.buildCode === person.buildCode)?.shortDescription ?? person.buildCode)
    : undefined;

  let hairColour = person?.hairColourCode
    ? (hairColourCodes?.find((code: HairColourType) => code.hairColourCode === person.hairColourCode)
        ?.shortDescription ?? person.hairColourCode)
    : undefined;

  if (person?.hairColourCode === "OTH" && person.hairColourOther) {
    hairColour = `Other (${person.hairColourOther})`;
  }

  const hairLength = person?.hairLengthCode
    ? (hairLengthCodes?.find((code: HairLengthType) => code.hairLengthCode === person.hairLengthCode)
        ?.shortDescription ?? person.hairLengthCode)
    : undefined;

  let eyeColour = person?.eyeColourCode
    ? (eyeColourCodes?.find((code: EyeColourType) => code.eyeColourCode === person.eyeColourCode)?.shortDescription ??
      person.eyeColourCode)
    : undefined;

  if (person?.eyeColourCode === "OTH" && person.eyeColourOther) {
    eyeColour = `Other (${person.eyeColourOther})`;
  }

  const facialHair = yesNo(person?.facialHairIndicator);

  const facialHairStyle = person?.facialHairStyleCodes
    ?.map(
      (ref) =>
        facialHairStyleCodeTable?.find(
          (code: FacialHairStyleType) => code.facialHairStyleCode === ref?.facialHairStyleCode,
        )?.shortDescription ?? ref,
    )
    .join(", ");

  const hasTattoos = yesNo(person?.tattooIndicator);

  return (
    <DetailSection title="Descriptors">
      <DetailField
        label="Height"
        value={heightDisplay}
      />
      <DetailField
        label="Weight"
        value={weightDisplay}
      />
      <DetailField
        label="Complexion"
        value={complexion}
      />
      <DetailField
        label="Build"
        value={build}
      />
      <DetailField
        label="Hair colour"
        value={hairColour}
      />
      <DetailField
        label="Hair length"
        value={hairLength}
      />
      <DetailField
        label="Additional hair descriptors"
        value={person?.additionalHairDescriptors}
      />
      <DetailField
        label="Eye colour"
        value={eyeColour}
      />
      <DetailField
        label="Facial hair"
        value={facialHair}
      />
      <DetailField
        label="Facial hair style"
        value={facialHairStyle}
      />
      <DetailField
        label="Has tattoos"
        value={hasTattoos}
      />
      <DetailField
        label="Tattoos descriptors"
        value={person?.tattooDescription}
      />
      <DetailField
        label="Additional descriptors"
        value={person?.additionalDescriptors}
      />
    </DetailSection>
  );
};
