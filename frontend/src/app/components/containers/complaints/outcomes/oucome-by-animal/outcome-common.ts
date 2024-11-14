import Option from "../../../../../types/app/option";
import { AnimalOutcome } from "@/app/types/app/complaints/outcomes/wildlife/animal-outcome";

interface OptionDictionaries {
  speciesList: Option[];
  sexes: Option[];
  ages: Option[];
  threatLevels: Option[];
  outcomes: Option[];
  officers: Option[];
}

export const getValue = (
  property: string,
  data: AnimalOutcome,
  optionLists: OptionDictionaries,
): Option | undefined => {
  const { speciesList, sexes, ages, threatLevels, outcomes, officers } = optionLists;

  switch (property) {
    case "species": {
      const { species } = data;
      return speciesList.find((item) => item.value === species);
    }
    case "sex": {
      const { sex } = data;
      return sexes.find((item) => item.value === sex);
    }

    case "age": {
      const { age } = data;
      return ages.find((item) => item.value === age);
    }

    case "threatLevel": {
      const { threatLevel } = data;
      return threatLevels.find((item) => item.value === threatLevel);
    }

    case "officer":
    case "assigned": {
      const { officer } = data;
      return officers.find((item) => item.value === officer);
    }

    case "outcome": {
      const { outcome } = data;
      return outcomes.find((item) => item.value === outcome);
    }
  }
};
