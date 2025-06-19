import { RoverOrientation } from "./rover-orientation";
import { CommandRover } from "./command-rover";
export interface EtatRover {
  position: { x: number; y: number };
  orientation: RoverOrientation;
  executedCommands: CommandRover[];
  succeeded: boolean;
}
