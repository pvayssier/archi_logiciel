import { CommandRover } from "@model";
import { StateRover } from "@model";
import { InitStateRover } from "@model";

export interface Broker {
  subscribeToCommands(callback: (commands: CommandRover[]) => void): void;
  subscribeToState(callback: (state: StateRover) => void): void;
  subscribeToInitialization(
    callback: (initStateRover: InitStateRover) => void
  ): void;

  publishCommand(commands: CommandRover[]): void;
  publishState(state: StateRover): void;
  publishInitialization(initStateRover: InitStateRover): void;

  waitForConnection(): Promise<void>;
}
