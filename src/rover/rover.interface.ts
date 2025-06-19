import { CommandRover } from "@model";
import { EtatRover } from "@model";

export interface IRover {
  followInstructions(instructions: [CommandRover]): EtatRover;
}
