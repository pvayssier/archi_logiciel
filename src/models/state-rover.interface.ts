import { RoverOrientation } from "./rover-orientation";
import { CommandRover } from "./command-rover";
import { SeenCell } from "./seen-cell";

export type Position = { x: number; y: number };

export interface StateRover {
  position: Position;
  orientation: RoverOrientation;
  lastCommand: CommandRover | null;
  isLastCommand: boolean;
  successed: boolean;
  seen: SeenCell[];
}
