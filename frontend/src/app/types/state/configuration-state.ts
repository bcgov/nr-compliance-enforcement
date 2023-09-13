import { ConfigurationType } from "../configurations/configuration";

export interface ConfigurationState {
  [key: string]: any;
  
  configurations: Array<ConfigurationType>;
}
