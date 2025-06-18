import { CommandRover } from "../models/CommandRover";
import { EtatRover } from "../models/EtatRover";

export interface Broker {
  subscribeToCommands(callback: (commands: CommandRover[]) => void): void;
  subscribeToResponses(callback: (response: EtatRover) => void): void;

  publishCommand(commands: CommandRover[]): void;
  publishResponse(response: EtatRover): void;
}
