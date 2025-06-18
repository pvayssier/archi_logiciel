import { CommandEnum } from "./missionControl.interface";

export interface UserInputInterface {
  waitForInput: () => Promise<CommandEnum[]>;
}