import {CommandEnum} from "./missionControl.interface";

export interface NetworkSenderInterface {
  sendToBroker: (commands: CommandEnum[]) => void
}