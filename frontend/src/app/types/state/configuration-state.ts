import { ConfigurationType } from "../configurations/configuration";

export interface ConfigurationState {
  configurations: Array<ConfigurationType> | undefined;
}
