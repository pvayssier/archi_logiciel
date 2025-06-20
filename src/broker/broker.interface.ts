import { CommandRover } from "@model";
import { EtatRover } from "@model";
import { InitEtatRover } from "@model";

export interface Broker {
  subscribeToCommands(callback: (commands: CommandRover[]) => void): void;
  subscribeToEtat(callback: (etat: EtatRover) => void): void;
  subscribeToInitialization(
    callback: (initEtatRover: InitEtatRover) => void
  ): void;

  publishCommand(commands: CommandRover[]): void;
  publishEtat(etat: EtatRover): void;
  publishInitialization(initEtatRover: InitEtatRover): void;

  waitForConnection(): Promise<void>;
}
