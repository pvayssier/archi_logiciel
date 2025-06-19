import { CommandRover } from "@model";
import { EtatRover } from "@model";

export interface IRover {
  followInstructions(commands: CommandRover[]): EtatRover;
}
