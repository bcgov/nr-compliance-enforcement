import { ConfigurationType } from "@apptypes/configurations/configuration";

export interface ConfigurationState {
  configurations: Array<ConfigurationType> | undefined;
}
